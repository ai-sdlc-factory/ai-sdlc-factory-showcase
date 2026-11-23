import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { version } from '../package.json';
import App from './App';
import { getWeather, type WeatherReading } from './api';

vi.mock('./api', () => ({ getWeather: vi.fn() }));
const reading: WeatherReading = { city: 'Riga', temperatureC: 12, condition: 'Cloudy', humidityPercent: 75 };

beforeEach(() => vi.mocked(getWeather).mockReset());

describe('weather search', () => {
  it('has a labelled input and starts without a result', () => {
    render(<App />);
    expect(screen.getByRole('textbox', { name: 'City' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Get weather' })).toBeEnabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    const footer = screen.getByText(`Weather v${version}`, { exact: true });
    expect(footer.tagName).toBe('FOOTER');
    expect(footer).toBeVisible();
  });

  it('shows loading, then announces all reading fields after keyboard submission', async () => {
    let resolveReading!: (value: WeatherReading) => void;
    vi.mocked(getWeather).mockReturnValue(new Promise(resolve => { resolveReading = resolve; }));
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('City'), ' Riga ');
    await user.keyboard('{Enter}');
    expect(getWeather).toHaveBeenCalledWith(' Riga ');
    expect(screen.getByRole('status')).toHaveTextContent('Loading weather');
    expect(screen.getByRole('button', { name: 'Searching…' })).toBeDisabled();
    expect(screen.getByText(`Weather v${version}`, { exact: true })).toBeVisible();
    await act(async () => resolveReading(reading));
    const result = screen.getByRole('status', { name: 'Weather reading' });
    expect(result).toHaveTextContent('Riga');
    expect(result).toHaveTextContent('Temperature12 °C');
    expect(result).toHaveTextContent('ConditionCloudy');
    expect(result).toHaveTextContent('Humidity75%');
    expect(screen.getByRole('button', { name: 'Get weather' })).toBeEnabled();
    const footer = screen.getByText(`Weather v${version}`, { exact: true });
    expect(footer).toBeVisible();
    expect(result.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('announces an error and allows a successful retry', async () => {
    vi.mocked(getWeather).mockRejectedValueOnce(new Error('No reading for this city.')).mockResolvedValueOnce(reading);
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('City'), 'Paris');
    await user.click(screen.getByRole('button', { name: 'Get weather' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No reading for this city.');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText(`Weather v${version}`, { exact: true })).toBeVisible();
    await user.clear(screen.getByLabelText('City'));
    await user.type(screen.getByLabelText('City'), 'Riga');
    await user.click(screen.getByRole('button', { name: 'Get weather' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Riga');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText(`Weather v${version}`, { exact: true })).toBeVisible();
  });

  it('clears a previous success when the next request fails', async () => {
    vi.mocked(getWeather).mockResolvedValueOnce(reading).mockRejectedValueOnce(new Error('Unavailable.'));
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('City'), 'Riga');
    await user.click(screen.getByRole('button', { name: 'Get weather' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Riga');
    await user.click(screen.getByRole('button', { name: 'Get weather' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Unavailable.');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

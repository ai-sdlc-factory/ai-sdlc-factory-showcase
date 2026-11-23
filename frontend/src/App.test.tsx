import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { version } from '../package.json';
import App from './App';
import { getWeather, type WeatherReading } from './api';

vi.mock('./api', () => ({ getWeather: vi.fn() }));
const reading: WeatherReading = { city: 'Riga', temperatureC: 12, condition: 'Cloudy', humidityPercent: 75, observedAt: '2026-01-15T09:00:00Z', feelsLikeC: 10.5 };

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
    expect(result).toHaveTextContent('Temperature12 °CFeels like10.5 °CCondition');
    expect(result).toHaveTextContent('ConditionCloudy');
    expect(result).toHaveTextContent('Humidity75%');
    expect(result).toHaveTextContent(`Observed at ${new Date(reading.observedAt).toLocaleString()}`);
    const time = result.querySelector('time');
    expect(time).toHaveAttribute('datetime', reading.observedAt);
    expect(time).toHaveTextContent(new Date(reading.observedAt).toLocaleString());
    expect(result.querySelector('dl')?.nextElementSibling).toContainElement(time);
    expect(screen.getByRole('button', { name: 'Get weather' })).toBeEnabled();
    const footer = screen.getByText(`Weather v${version}`, { exact: true });
    expect(footer).toBeVisible();
    expect(result.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('displays an integer feels-like value without a trailing decimal zero', async () => {
    vi.mocked(getWeather).mockResolvedValue({ city: 'London', temperatureC: 15, condition: 'Rainy', humidityPercent: 80, feelsLikeC: 13, observedAt: '2026-01-15T09:00:00Z' });
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('City'), 'London');
    await user.click(screen.getByRole('button', { name: 'Get weather' }));
    const result = await screen.findByRole('status', { name: 'Weather reading' });
    expect(result).toHaveTextContent('Temperature15 °CFeels like13 °CCondition');
    expect(result).not.toHaveTextContent('13.0');
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

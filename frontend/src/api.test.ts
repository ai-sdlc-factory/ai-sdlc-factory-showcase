import { describe, expect, it, vi } from 'vitest';
import { getWeather } from './api';

const reading = { city: 'Riga', temperatureC: 12, condition: 'Cloudy', humidityPercent: 75, observedAt: '2026-01-15T09:00:00Z' };

describe('getWeather', () => {
  it('returns the reading and encodes the untrimmed city in the URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(reading));
    vi.stubGlobal('fetch', fetchMock);
    await expect(getWeather(' Riga ')).resolves.toEqual(reading);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5080/api/weather/%20Riga%20');
  });

  it('encodes characters that could change the request path', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(reading));
    vi.stubGlobal('fetch', fetchMock);
    await getWeather('a/b?#');
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5080/api/weather/a%2Fb%3F%23');
  });

  it.each([400, 404])('surfaces the API error for status %s', async status => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'City unavailable.' }, { status })));
    await expect(getWeather('Unknown')).rejects.toThrow('City unavailable.');
  });

  it.each(['not json', '{}', '{"error":""}'])('handles an unusable error body: %s', async body => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body, { status: 500 })));
    await expect(getWeather('Riga')).rejects.toThrow('Unable to get a weather reading.');
  });

  it('handles network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(getWeather('Riga')).rejects.toThrow('Unable to reach the weather service.');
  });

  it.each([null, { city: 'Riga' }, { ...reading, humidityPercent: '75' }])('rejects malformed readings: %s', async body => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body)));
    await expect(getWeather('Riga')).rejects.toThrow('invalid reading');
  });

  it('rejects a missing observation time on an otherwise valid reading', async () => {
    const { observedAt: _observedAt, ...withoutObservedAt } = reading;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(withoutObservedAt)));
    await expect(getWeather('Riga')).rejects.toThrow('The weather service returned an invalid reading.');
  });

  it.each([null, 123, '', 'not a timestamp'])('rejects an invalid observation time: %s', async observedAt => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...reading, observedAt })));
    await expect(getWeather('Riga')).rejects.toThrow('The weather service returned an invalid reading.');
  });
});

export interface WeatherReading {
  city: string;
  temperatureC: number;
  condition: string;
  humidityPercent: number;
  observedAt: string;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5080').replace(/\/$/, '');

export async function getWeather(city: string): Promise<WeatherReading> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/weather/${encodeURIComponent(city)}`);
  } catch {
    throw new Error('Unable to reach the weather service. Please try again.');
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (typeof body === 'object' && body !== null && 'error' in body
      && typeof body.error === 'string' && body.error.trim()) {
      throw new Error(body.error);
    }
    throw new Error('Unable to get a weather reading. Please try again.');
  }

  if (typeof body !== 'object' || body === null
    || !('city' in body) || typeof body.city !== 'string'
    || !('temperatureC' in body) || typeof body.temperatureC !== 'number'
    || !('condition' in body) || typeof body.condition !== 'string'
    || !('humidityPercent' in body) || typeof body.humidityPercent !== 'number'
    || !('observedAt' in body) || typeof body.observedAt !== 'string'
    || !Number.isFinite(Date.parse(body.observedAt))) {
    throw new Error('The weather service returned an invalid reading.');
  }
  return {
    city: body.city,
    temperatureC: body.temperatureC,
    condition: body.condition,
    humidityPercent: body.humidityPercent,
    observedAt: body.observedAt,
  };
}

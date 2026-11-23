import { useState, type FormEvent } from 'react';
import { version } from '../package.json';
import { getWeather, type WeatherReading } from './api';

type SearchState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; reading: WeatherReading };

export default function App() {
  const [city, setCity] = useState('');
  const [state, setState] = useState<SearchState>({ kind: 'idle' });

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === 'loading') return;
    setState({ kind: 'loading' });
    try {
      const reading = await getWeather(city);
      setState({ kind: 'success', reading });
    } catch (error) {
      setState({ kind: 'error', message: error instanceof Error ? error.message : 'Unable to get a weather reading.' });
    }
  }

  return (
    <main>
      <header>
        <p className="eyebrow">A little weather, a little certainty</p>
        <h1>City weather</h1>
        <p>Explore fixed, simulated readings — not live weather.</p>
      </header>
      <form onSubmit={search}>
        <label htmlFor="city">City</label>
        <p id="city-help">Try Riga, London, Oslo, Madrid or Cairo.</p>
        <div className="search-row">
          <input
            id="city"
            name="city"
            type="text"
            value={city}
            onChange={event => setCity(event.target.value)}
            aria-describedby="city-help"
          />
          <button type="submit" disabled={state.kind === 'loading'}>
            {state.kind === 'loading' ? 'Searching…' : 'Get weather'}
          </button>
        </div>
      </form>
      {state.kind === 'loading' && <p role="status">Loading weather…</p>}
      {state.kind === 'error' && <p className="error" role="alert">{state.message}</p>}
      {state.kind === 'success' && (
        <section className="reading" role="status" aria-label="Weather reading">
          <h2>{state.reading.city}</h2>
          <dl>
            <div><dt>Temperature</dt><dd>{state.reading.temperatureC} °C</dd></div>
            <div><dt>Condition</dt><dd>{state.reading.condition}</dd></div>
            <div><dt>Humidity</dt><dd>{state.reading.humidityPercent}%</dd></div>
          </dl>
        </section>
      )}
      <footer>Weather v{version}</footer>
    </main>
  );
}

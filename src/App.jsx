import { useEffect } from 'react';
import styles from './App.module.css';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './components/WeatherCard/WeatherCard';
import ForecastList from './components/ForecastList/ForecastList';
import SuggestionPanel from './components/SuggestionPanel/SuggestionPanel';
import Loader from './components/Loader/Loader';
import { generateSuggestions } from './utils/suggestions';
import { AlertCircle, MapPin, Key } from 'lucide-react';

function App() {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    locationName,
    handleCitySearch,
    detectLocation,
  } = useWeather();

  const apiKeyMissing = !import.meta.env.VITE_WEATHER_API_KEY;

  // Dynamic background based on weather temp
  useEffect(() => {
    if (currentWeather) {
      const temp = currentWeather.main.temp;
      const htmlBody = document.documentElement;
      if (temp < 10) {
        htmlBody.setAttribute('data-theme', 'cold');
      } else if (temp >= 10 && temp < 25) {
        htmlBody.setAttribute('data-theme', 'moderate');
      } else {
        htmlBody.setAttribute('data-theme', 'hot');
      }
    }
  }, [currentWeather]);

  if (apiKeyMissing) {
    return (
      <div className={styles.appContainer}>
        <div className={`${styles.error} glass`} style={{ marginTop: '20vh', flexDirection: 'column', padding: '3rem', textAlign: 'center' }}>
          <Key size={48} />
          <h2 style={{ fontSize: '2rem', margin: '1rem 0' }}>API Key Missing</h2>
          <p>Please add your OpenWeatherMap API key to the <code>.env</code> file:</p>
          <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>VITE_WEATHER_API_KEY="your_api_key_here"</pre>
        </div>
      </div>
    );
  }

  const suggestions = generateSuggestions(currentWeather);

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.locationContainer}>
          <MapPin size={24} className={styles.locationIcon} />
          <h1>{locationName || 'Smart City Weather'}</h1>
        </div>
        <div className={styles.searchSection}>
          <SearchBar onSearch={handleCitySearch} onLocate={detectLocation} />
        </div>
      </header>

      <main className={styles.mainContent}>
        {loading && <Loader />}
        
        {error && !loading && (
          <div className={`${styles.error} glass`}>
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && currentWeather && (
          <div className={styles.dashboard}>
            <div className={styles.leftColumn}>
              <WeatherCard weather={currentWeather} className="animate-fade" />
              {forecast && <ForecastList forecast={forecast} className="animate-fade" style={{ animationDelay: '0.2s' }} />}
            </div>
            
            <div className={styles.rightColumn}>
              <SuggestionPanel suggestions={suggestions} className="animate-slide" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

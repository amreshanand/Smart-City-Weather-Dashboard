import { useEffect } from 'react';
import styles from './App.module.css';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './components/WeatherCard/WeatherCard';
import ForecastList from './components/ForecastList/ForecastList';
import SuggestionPanel from './components/SuggestionPanel/SuggestionPanel';
import RecentSearches from './components/RecentSearches/RecentSearches';
import Settings from './components/Settings/Settings';
import Background from './components/Background';
import Loader from './components/Loader/Loader';
import { generateSuggestions } from './utils/suggestions';
import { AlertCircle, Key, Cloud } from 'lucide-react';

function App() {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    recentSearches,
    unit,
    setUnit,
    handleCitySearch,
    detectLocation,
  } = useWeather();

  const apiKeyMissing = !import.meta.env.VITE_WEATHER_API_KEY;

  if (apiKeyMissing) {
    return (
      <div className={styles.appContainer}>
        <Background />
        <div className={`${styles.error} glass animate-entrance`} style={{ marginTop: '20vh', flexDirection: 'column', padding: '3rem', textAlign: 'center' }}>
          <Key size={48} color="var(--primary)" />
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
      <Background />
      
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Cloud size={32} weight="fill" />
          </div>
          <div className={styles.logoText}>
            <h1>SkyCast</h1>
            <span>Smart City Weather</span>
          </div>
        </div>
        <div className={styles.searchSection}>
          <SearchBar onSearch={handleCitySearch} onLocate={detectLocation} />
        </div>
      </header>

      <main className={styles.mainContent}>
        {loading && <Loader />}
        
        {error && !loading && (
          <div className={`${styles.error} glass animate-entrance`}>
            <AlertCircle size={24} color="#ef4444" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && currentWeather && (
          <div className={styles.dashboard}>
            <div className={styles.leftColumn}>
              <WeatherCard 
                weather={currentWeather} 
                unit={unit} 
                className="animate-entrance" 
              />
              {forecast && (
                <ForecastList 
                  forecast={forecast} 
                  unit={unit} 
                  className="animate-entrance" 
                />
              )}
            </div>
            
            <div className={styles.rightColumn}>
              <SuggestionPanel suggestions={suggestions} />
              <RecentSearches searches={recentSearches} onSearch={handleCitySearch} />
              <Settings unit={unit} setUnit={setUnit} />
            </div>
          </div>
        )}
      </main>

      <footer className={styles.appFooter}>
        <p>© 2026 SkyCast AI. Powered by OpenWeather and Open-Meteo.</p>
      </footer>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
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
import { getApiKey } from './utils/api';
import { AlertCircle, Key, Cloud, Check } from 'lucide-react';

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

  const [manualKey, setManualKey] = useState('');
  const apiKey = getApiKey();
  const apiKeyMissing = !apiKey || apiKey === 'your_api_key_here';

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (manualKey.trim().length > 20) {
      localStorage.setItem('weather_api_key', manualKey.trim());
      window.location.reload();
    }
  };

  // Dynamic weather theme attribute
  useEffect(() => {
    if (currentWeather) {
      const condition = currentWeather.weather[0].main.toLowerCase();
      document.documentElement.setAttribute('data-weather', condition);
    }
  }, [currentWeather]);

  if (apiKeyMissing) {
    return (
      <div className={styles.appContainer}>
        <Background />
        <div className={`${styles.error} glass animate-entrance`} style={{ marginTop: '15vh', flexDirection: 'column', padding: '3rem', textAlign: 'center', gap: '1rem' }}>
          <div className={styles.logoIcon} style={{ margin: '0 auto', width: '80px', height: '80px' }}>
            <Key size={40} color="white" />
          </div>
          <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>API Key Required</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}> To display live weather data, please provide your OpenWeatherMap API key.</p>
          
          <form onSubmit={handleSaveKey} style={{ width: '100%', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Paste your API key here..." 
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                padding: '1rem',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center',
                fontSize: '1rem'
              }}
            />
            <button 
              type="submit" 
              disabled={manualKey.length < 20}
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                opacity: manualKey.length < 20 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Check size={20} />
              Save & Refresh
            </button>
          </form>
          
          <p style={{ fontSize: '0.8rem', marginTop: '2rem', color: 'var(--text-dim)' }}>
            Your key is saved locally in your browser. For a permanent fix, set <code>VITE_WEATHER_API_KEY</code> in your environment variables.
          </p>
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
            <Cloud size={32} />
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

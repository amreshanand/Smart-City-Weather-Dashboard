import { useState, useEffect, useCallback } from 'react';
import { 
  fetchCurrentWeather, 
  fetchCurrentWeatherByCoords, 
  fetch7DayForecast 
} from '../utils/api';

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recent_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'

  const addToRecentSearches = useCallback((city) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, 5);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleCitySearch = useCallback(async (city) => {
    try {
      setLoading(true);
      setError(null);
      const current = await fetchCurrentWeather(city);
      const forecastData = await fetch7DayForecast(current.coord.lat, current.coord.lon);
      
      setCurrentWeather(current);
      setForecast(forecastData);
      setLocationName(current.name);
      addToRecentSearches(current.name);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [addToRecentSearches]);

  const handleLocationSearch = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const current = await fetchCurrentWeatherByCoords(lat, lon);
      const forecastData = await fetch7DayForecast(lat, lon);
      
      setCurrentWeather(current);
      setForecast(forecastData);
      setLocationName(current.name);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data for your location');
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      handleCitySearch('London');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationSearch(latitude, longitude);
      },
      (geoErr) => {
        handleCitySearch('London');
      },
      { timeout: 10000 }
    );
  }, [handleLocationSearch, handleCitySearch]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    locationName,
    recentSearches,
    unit,
    setUnit,
    handleCitySearch,
    detectLocation
  };
};

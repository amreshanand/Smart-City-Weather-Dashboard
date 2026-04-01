import { useState, useEffect, useCallback } from 'react';
import { 
  fetchCurrentWeather, 
  fetchCurrentWeatherByCoords, 
  fetchForecast, 
  fetchForecastByCoords 
} from '../utils/api';

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');

  const handleCitySearch = useCallback(async (city) => {
    try {
      setLoading(true);
      setError(null);
      const [current, forecastData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city)
      ]);
      setCurrentWeather(current);
      setForecast(forecastData);
      setLocationName(current.name);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocationSearch = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const [current, forecastData] = await Promise.all([
        fetchCurrentWeatherByCoords(lat, lon),
        fetchForecastByCoords(lat, lon)
      ]);
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
      setError('Geolocation is not supported by your browser');
      handleCitySearch('London'); // default
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationSearch(latitude, longitude);
      },
      (geoErr) => {
        console.warn('Geolocation denied or failed', geoErr);
        handleCitySearch('New York'); // fallback default
      },
      { timeout: 10000 }
    );
  }, [handleLocationSearch, handleCitySearch]);

  // Initial load effect
  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    locationName,
    handleCitySearch,
    detectLocation
  };
};

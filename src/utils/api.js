export const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || ''; // Needs to be added in .env
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather by city name 
 */
export const fetchCurrentWeather = async (city) => {
  const res = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
  if (res.status === 401) throw new Error('Invalid or unauthorized API Key. Please check your .env file.');
  if (!res.ok) throw new Error('City not found');
  return res.json();
};

/**
 * Fetch current weather by coordinates
 */
export const fetchCurrentWeatherByCoords = async (lat, lon) => {
  const res = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (res.status === 401) throw new Error('Invalid or unauthorized API Key. Please check your .env file.');
  if (!res.ok) throw new Error('Location not found');
  return res.json();
};

/**
 * Fetch 5-day forecast by city
 */
export const fetchForecast = async (city) => {
  const res = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  if (res.status === 401) throw new Error('Invalid or unauthorized API Key. Please check your .env file.');
  if (!res.ok) throw new Error('Forecast not found');
  return res.json();
};

/**
 * Fetch 5-day forecast by coordinates
 */
export const fetchForecastByCoords = async (lat, lon) => {
  const res = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (res.status === 401) throw new Error('Invalid or unauthorized API Key. Please check your .env file.');
  if (!res.ok) throw new Error('Forecast not found');
  return res.json();
};

/**
 * Format timestamp into readable time string
 */
export const formatTime = (unixMs, timezoneOffset = 0) => {
  const date = new Date((unixMs + timezoneOffset) * 1000);
  // Subtract local timezone offset to display time in the location's actual timezone
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const localDate = new Date(utc + (timezoneOffset * 1000));
  
  return localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

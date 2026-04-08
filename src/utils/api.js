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
 * Fetch 7-day forecast by coordinates using Open-Meteo
 */
export const fetch7DayForecast = async (lat, lon) => {
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=auto`);
  if (!res.ok) throw new Error('Forecast data unavailable');
  const data = await res.json();
  
  // Format Open-Meteo daily data to a more usable format
  return data.daily.time.map((date, index) => ({
    date,
    temp_max: data.daily.temperature_2m_max[index],
    temp_min: data.daily.temperature_2m_min[index],
    weather_code: data.daily.weathercode[index],
    wind_speed: data.daily.windspeed_10m_max[index]
  }));
};

/**
 * Fetch 5-day forecast by city (Keeping for compatibility or fallback)
 */
export const fetchForecast = async (city) => {
  const res = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  if (res.status === 401) throw new Error('Invalid or unauthorized API Key. Please check your .env file.');
  if (!res.ok) throw new Error('Forecast not found');
  return res.json();
};

/**
 * Format timestamp into readable time string
 */
export const formatTime = (unixMs, timezoneOffset = 0) => {
  const date = new Date((unixMs + timezoneOffset) * 1000);
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const localDate = new Date(utc + (timezoneOffset * 1000));
  return localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

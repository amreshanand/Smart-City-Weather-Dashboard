export const generateSuggestions = (weather) => {
  if (!weather) return [];
  const suggestions = [];

  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed; // usually m/s
  const conditionId = weather.weather[0].id;
  
  // Temperature-based suggestions
  if (temp < 10) {
    suggestions.push({
      id: 'temp-cold',
      icon: 'ThermometerSnowflake',
      text: 'Wear a thick coat and layer up.',
      type: 'warning'
    });
  } else if (temp >= 10 && temp < 20) {
    suggestions.push({
      id: 'temp-mod',
      icon: 'Shirt',
      text: 'A light jacket or sweater should be enough.',
      type: 'info'
    });
  } else if (temp > 30) {
    suggestions.push({
      id: 'temp-hot',
      icon: 'SunDim',
      text: 'Stay hydrated and wear breathable clothes.',
      type: 'warning'
    });
  }

  // Precipitation-based suggestions (OpenWeatherMap IDs: https://openweathermap.org/weather-conditions)
  if (conditionId >= 200 && conditionId < 600) {
    // Rain or Drizzle or Thunderstorm
    suggestions.push({
      id: 'rain',
      icon: 'Umbrella',
      text: 'Carry an umbrella, rain expected.',
      type: 'alert'
    });
  } else if (conditionId >= 600 && conditionId < 700) {
    // Snow
    suggestions.push({
      id: 'snow',
      icon: 'Snowflake',
      text: 'Snowy conditions. Wear proper boots.',
      type: 'alert'
    });
  }

  // Wind suggestions
  if (wind > 10) { // roughly 36 km/h
    suggestions.push({
      id: 'wind-strong',
      icon: 'Wind',
      text: 'Strong winds! Avoid risky outdoor activities.',
      type: 'warning'
    });
  }

  // Atmospheric conditions
  if (conditionId === 711 || conditionId === 721 || conditionId === 741) { // Smoke, haze, fog
    suggestions.push({
      id: 'haze',
      icon: 'CloudFog',
      text: 'Poor visibility and air quality. Drive safely.',
      type: 'warning'
    });
  }
  
  // UV / Sun (approximating clear sky + high temp as Sun risk since we don't have free UV index API directly in the standard call)
  if (conditionId === 800 && temp > 25) {
    suggestions.push({
      id: 'uv',
      icon: 'Sun',
      text: 'High sun exposure. Use sunscreen and wear shades.',
      type: 'info'
    });
  }

  // Fallback if very clear and nice
  if (suggestions.length === 0 && conditionId === 800) {
    suggestions.push({
      id: 'perfect',
      icon: 'Smile',
      text: 'Great weather! Perfect for a walk outside.',
      type: 'info'
    });
  }

  return suggestions;
};

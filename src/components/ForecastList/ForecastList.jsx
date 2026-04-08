import React from 'react';
import styles from './ForecastList.module.css';
import { 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  Sun, 
  Cloud,
  Wind
} from 'lucide-react';

const ForecastList = ({ forecast, unit, className }) => {
  const getIcon = (code) => {
    const props = { size: 40, strokeWidth: 1.5, className: styles.itemIcon };
    // Open-Meteo WMO weather codes
    if (code === 0) return <Sun {...props} />;
    if (code >= 1 && code <= 3) return <Cloud {...props} />;
    if (code >= 45 && code <= 48) return <Cloud {...props} />;
    if (code >= 51 && code <= 67) return <CloudDrizzle {...props} />;
    if (code >= 71 && code <= 77) return <CloudSnow {...props} />;
    if (code >= 80 && code <= 82) return <CloudRain {...props} />;
    if (code >= 95) return <CloudLightning {...props} />;
    return <Cloud {...props} />;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const convertTemp = (temp) => {
    if (unit === 'imperial') return Math.round((temp * 9/5) + 32);
    return Math.round(temp);
  };

  return (
    <div className={`${styles.container} glass animate-entrance ${className}`} style={{ animationDelay: '0.2s' }}>
      <div className={styles.header}>
        <h3>7-Day Forecast</h3>
        <span className={styles.badge}>Next Week</span>
      </div>
      
      <div className={styles.list}>
        {forecast.map((day, index) => (
          <div key={index} className={styles.item}>
            <span className={styles.day}>{getDayName(day.date)}</span>
            <div className={styles.iconWrapper}>
              {getIcon(day.weather_code)}
            </div>
            <div className={styles.tempRange}>
              <span className={styles.max}>{convertTemp(day.temp_max)}°</span>
              <span className={styles.min}>{convertTemp(day.temp_min)}°</span>
            </div>
            <div className={styles.windInfo}>
              <Wind size={12} />
              <span>{Math.round(day.wind_speed)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList;

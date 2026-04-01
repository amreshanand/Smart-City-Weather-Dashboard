import { useMemo } from 'react';
import styles from './ForecastList.module.css';
import { 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  Sun, 
  Cloud 
} from 'lucide-react';

const ForecastList = ({ forecast, className, style }) => {
  // Extract one reading per day (around 12:00 PM or the closest available)
  const dailyForecast = useMemo(() => {
    if (!forecast || !forecast.list) return [];
    
    const days = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      // prefer noon reading if possible
      if (!days[date] || item.dt_txt.includes('12:00:00')) {
        days[date] = item;
      }
    });

    // Take next 5 days (excluding today if we have more than 5)
    return Object.values(days).slice(0, 5);
  }, [forecast]);

  const getIcon = (id) => {
    if (id >= 200 && id < 300) return <CloudLightning size={32} />;
    if (id >= 300 && id < 400) return <CloudDrizzle size={32} />;
    if (id >= 500 && id < 600) return <CloudRain size={32} />;
    if (id >= 600 && id < 700) return <CloudSnow size={32} />;
    if (id === 800) return <Sun size={32} />;
    return <Cloud size={32} />;
  };

  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    if (date.getDay() === today.getDay()) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className={`${styles.forecastContainer} ${className}`} style={style}>
      <h3 className={styles.title}>5-Day Forecast</h3>
      
      <div className={styles.scrollWrapper}>
        <div className={styles.list}>
          {dailyForecast.map((reading) => (
            <div key={reading.dt} className={`${styles.item} glass`}>
              <span className={styles.day}>{getDayName(reading.dt)}</span>
              <div className={styles.iconWrapper}>
                {getIcon(reading.weather[0].id)}
              </div>
              <div className={styles.tempRange}>
                <span className={styles.max}>{Math.round(reading.main.temp_max)}°</span>
                <span className={styles.min}>{Math.round(reading.main.temp_min)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastList;

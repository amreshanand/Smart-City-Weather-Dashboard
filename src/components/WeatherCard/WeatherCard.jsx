import { useMemo } from 'react';
import styles from './WeatherCard.module.css';
import { 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  Sun, 
  Cloud,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Sunrise,
  Sunset
} from 'lucide-react';
import { formatTime } from '../../utils/api';

const WeatherCard = ({ weather, className }) => {
  const { main, weather: wt, wind, visibility, sys, timezone } = weather;
  const condition = wt[0];
  const isNight = Date.now() / 1000 > sys.sunset; 

  const icon = useMemo(() => {
    const id = condition.id;
    if (id >= 200 && id < 300) return <CloudLightning size={80} />;
    if (id >= 300 && id < 400) return <CloudDrizzle size={80} />;
    if (id >= 500 && id < 600) return <CloudRain size={80} />;
    if (id >= 600 && id < 700) return <CloudSnow size={80} />;
    if (id === 800) return <Sun size={80} />;
    return <Cloud size={80} />;
  }, [condition.id]);

  return (
    <div className={`${styles.card} glass ${className}`}>
      <div className={styles.topSection}>
        <div className={styles.conditionBox}>
          <div className={styles.iconContainer}>
            {icon}
          </div>
          <div>
            <h2 className={styles.temp}>{Math.round(main.temp)}°C</h2>
            <p className={styles.description}>{condition.description}</p>
          </div>
        </div>
      </div>
      
      <div className={styles.divider}></div>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <Thermometer size={20} className={styles.metricIcon}/>
          <div>
            <span className={styles.label}>Feels like</span>
            <p className={styles.value}>{Math.round(main.feels_like)}°C</p>
          </div>
        </div>
        
        <div className={styles.metric}>
          <Droplets size={20} className={styles.metricIcon}/>
          <div>
            <span className={styles.label}>Humidity</span>
            <p className={styles.value}>{main.humidity}%</p>
          </div>
        </div>

        <div className={styles.metric}>
          <Wind size={20} className={styles.metricIcon}/>
          <div>
            <span className={styles.label}>Wind</span>
            <p className={styles.value}>{wind.speed} m/s</p>
          </div>
        </div>

        <div className={styles.metric}>
          <Eye size={20} className={styles.metricIcon}/>
          <div>
            <span className={styles.label}>Visibility</span>
            <p className={styles.value}>{(visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>

        <div className={styles.metric}>
          <Sunrise size={20} className={styles.metricIcon}/>
          <div>
            <span className={styles.label}>Sunrise</span>
            <p className={styles.value}>{formatTime(sys.sunrise, timezone)}</p>
          </div>
        </div>

        <div className={styles.metric}>
          <Sunset size={20} className={styles.metricIcon}/>
          <div>
            <span className={styles.label}>Sunset</span>
            <p className={styles.value}>{formatTime(sys.sunset, timezone)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

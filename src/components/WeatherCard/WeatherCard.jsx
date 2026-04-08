import { useMemo, useState, useRef } from 'react';
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
  Sunset,
  Navigation
} from 'lucide-react';
import { formatTime } from '../../utils/api';

const WeatherCard = ({ weather, unit, className }) => {
  const { main, weather: wt, wind, visibility, sys, timezone, name } = weather;
  const condition = wt[0];
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 10;
    const rotateY = (x - centerX) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const icon = useMemo(() => {
    const id = condition.id;
    const props = { size: 100, strokeWidth: 1.5, className: styles.mainIcon };
    if (id >= 200 && id < 300) return <CloudLightning {...props} />;
    if (id >= 300 && id < 400) return <CloudDrizzle {...props} />;
    if (id >= 500 && id < 600) return <CloudRain {...props} />;
    if (id >= 600 && id < 700) return <CloudSnow {...props} />;
    if (id === 800) return <Sun {...props} />;
    return <Cloud {...props} />;
  }, [condition.id]);

  const temp = unit === 'imperial' ? (main.temp * 9/5) + 32 : main.temp;
  const feelsLike = unit === 'imperial' ? (main.feels_like * 9/5) + 32 : main.feels_like;
  const unitSym = unit === 'imperial' ? '°F' : '°C';

  return (
    <div 
      ref={cardRef}
      className={`${styles.card} glass card-3d animate-entrance ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
      }}
    >
      <div className={styles.header}>
        <div className={styles.locationInfo}>
          <h2>{name}</h2>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className={styles.badge}>{condition.main}</div>
      </div>

      <div className={styles.mainInfo}>
        <div className={styles.iconContainer}>
          {icon}
        </div>
        <div className={styles.tempContainer}>
          <h1 className={styles.temp}>{Math.round(temp)}{unitSym}</h1>
          <p className={styles.description}>{condition.description}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.metric}>
          <Thermometer className={styles.icon} />
          <div className={styles.metricText}>
            <span>Feels Like</span>
            <p>{Math.round(feelsLike)}{unitSym}</p>
          </div>
        </div>
        <div className={styles.metric}>
          <Droplets className={styles.icon} />
          <div className={styles.metricText}>
            <span>Humidity</span>
            <p>{main.humidity}%</p>
          </div>
        </div>
        <div className={styles.metric}>
          <Wind className={styles.icon} />
          <div className={styles.metricText}>
            <span>Wind Speed</span>
            <p>{wind.speed} {unit === 'imperial' ? 'mph' : 'm/s'}</p>
          </div>
        </div>
        <div className={styles.metric}>
          <Navigation className={styles.icon} style={{ transform: `rotate(${wind.deg}deg)` }} />
          <div className={styles.metricText}>
            <span>Direction</span>
            <p>{wind.deg}°</p>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.sunTime}>
          <Sunrise size={18} />
          <span>{formatTime(sys.sunrise, timezone)}</span>
        </div>
        <div className={styles.sunTime}>
          <Sunset size={18} />
          <span>{formatTime(sys.sunset, timezone)}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

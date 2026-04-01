import styles from './SuggestionPanel.module.css';
import { 
  ThermometerSnowflake, 
  Shirt, 
  SunDim, 
  Umbrella, 
  Snowflake, 
  Wind, 
  CloudFog, 
  Sun,
  Smile,
  Lightbulb
} from 'lucide-react';

const iconMap = {
  ThermometerSnowflake: <ThermometerSnowflake size={24} />,
  Shirt: <Shirt size={24} />,
  SunDim: <SunDim size={24} />,
  Umbrella: <Umbrella size={24} />,
  Snowflake: <Snowflake size={24} />,
  Wind: <Wind size={24} />,
  CloudFog: <CloudFog size={24} />,
  Sun: <Sun size={24} />,
  Smile: <Smile size={24} />
};

const SuggestionPanel = ({ suggestions, className }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={`${styles.panel} glass ${className}`}>
      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <Lightbulb size={24} className={styles.headerIcon} />
        </div>
        <h2>Smart Insights</h2>
      </div>

      <div className={styles.list}>
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className={`${styles.card} ${styles[suggestion.type]} glass`}>
            <div className={styles.cardIcon}>
              {iconMap[suggestion.icon]}
            </div>
            <p className={styles.cardText}>{suggestion.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionPanel;

import React from 'react';
import styles from './Settings.module.css';
import { Settings as SettingsIcon, Sun, Moon, Thermometer } from 'lucide-react';

const Settings = ({ unit, setUnit, theme, setTheme }) => {
  return (
    <div className={`${styles.container} glass animate-entrance`} style={{ animationDelay: '0.5s' }}>
      <div className={styles.header}>
        <SettingsIcon size={18} />
        <span>Settings</span>
      </div>
      
      <div className={styles.settingRow}>
        <div className={styles.label}>
          <Thermometer size={16} />
          <span>Units</span>
        </div>
        <div className={styles.toggle}>
          <button 
            className={unit === 'metric' ? styles.active : ''} 
            onClick={() => setUnit('metric')}
          >°C</button>
          <button 
            className={unit === 'imperial' ? styles.active : ''} 
            onClick={() => setUnit('imperial')}
          >°F</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

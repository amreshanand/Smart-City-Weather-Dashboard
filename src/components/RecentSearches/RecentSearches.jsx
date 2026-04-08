import React from 'react';
import styles from './RecentSearches.module.css';
import { History, Search } from 'lucide-react';

const RecentSearches = ({ searches, onSearch }) => {
  if (!searches || searches.length === 0) return null;

  return (
    <div className={`${styles.container} glass animate-entrance`} style={{ animationDelay: '0.4s' }}>
      <div className={styles.header}>
        <History size={18} />
        <span>Recent Searches</span>
      </div>
      <div className={styles.list}>
        {searches.map((city, index) => (
          <button 
            key={index} 
            className={styles.item}
            onClick={() => onSearch(city)}
          >
            <Search size={14} />
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;

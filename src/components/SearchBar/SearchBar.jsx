import { useState, useRef, useEffect } from 'react';
import styles from './SearchBar.module.css';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, onLocate }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(stored);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const saveSearch = (searchQuery) => {
    let searches = [searchQuery, ...recentSearches.filter(q => q !== searchQuery)].slice(0, 5);
    setRecentSearches(searches);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
    saveSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (searchQuery) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    saveSearch(searchQuery);
    setShowSuggestions(false);
  };

  return (
    <div className={styles.searchContainer} ref={wrapperRef}>
      <form onSubmit={handleSearch} className={`${styles.searchBox} glass`}>
        <Search size={20} className={styles.icon} />
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className={styles.input}
        />
        <button type="button" onClick={onLocate} className={styles.locateBtn} aria-label="Use current location">
          <MapPin size={20} />
        </button>
      </form>

      {showSuggestions && recentSearches.length > 0 && (
        <ul className={`${styles.suggestionsList} glass`}>
          {recentSearches.map((s, idx) => (
            <li 
              key={idx} 
              onClick={() => handleSuggestionClick(s)}
              className={styles.suggestionItem}
            >
              <Search size={14} className={styles.suggestionIcon} />
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>Fetching weather data...</p>
    </div>
  );
};

export default Loader;

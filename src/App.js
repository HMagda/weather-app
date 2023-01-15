import React, {useEffect, useState} from 'react';
// import axios from 'axios';
import styles from './styles/styles.module.scss';

const App = () => {
  const [capitals, setCapitals] = useState(null);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    console.log('use eff ran');
    fetch('http://localhost:5000/countries_with_capitals')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCapitals(data);
      });
  }, []);

  const searchLocation = (e) => {
    setSelected(e.target.value);
    console.log('e.target.value', e.target.value);
  };

  return (
    <div className={styles.app}>
      <div className={styles.wrapper}>
        <h1 className={styles.page_title}>Weather in Capitals Worldwide</h1>

        <div className={styles.main}>
          <div className={styles.location}>
            <select
              value={selected}
              // onChange={(e) => setSelected(e.target.value)}
              onChange={searchLocation}
            >
              <option disabled className={styles.instruction}>
                Click to choose the capital city
              </option>
              {capitals &&
                capitals.map((elem, i) => (
                  <option key={i}>
                    {elem.city}, {elem.country}
                  </option>
                ))}
            </select>

            <p>
              {selected ? selected : 'Click above to choose the capital city'}
            </p>
          </div>
          <div className={styles.temperature}>
            <p className={styles.value}>276.01°K</p>
          </div>
        </div>

        <div className={styles.addition}>
          <div className={styles.container}>
            <h2>feels like</h2>
            <p className={styles.value}>271.48°K</p>
          </div>
          <div className={styles.container}>
            <h2>wind speed</h2>
            <p className={styles.value}> 5.66 m/sec</p>
          </div>
          <div className={styles.container}>
            <h2>cloudiness</h2>
            <p className={styles.value}>75%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

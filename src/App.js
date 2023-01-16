import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles/styles.module.scss';

const App = () => {
  const [capitals, setCapitals] = useState(null);
  const [selected, setSelected] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    console.log('use eff with fetch countries list ran');
    fetch('http://localhost:5000/countries_with_capitals')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCapitals(data);
      });
  }, []);

  const updateState = (e) => {
    console.log('searchLocation ran');
    setSelected(e.target.value);
  };

  useEffect(() => {
    console.log('use eff with axios get api_url ran');

    //here you will have correct value in selected
    let selected_arr = [];
    selected_arr = selected.split(',');
    let selectedCity = selected_arr[0];
    selectedCity = encodeURIComponent(selectedCity);
    const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${process.env.REACT_APP_API_KEY}`;

    axios.get(api_url).then((res) => {
      setData(res.data);
      console.log('res.data', res.data);
    });
  }, [selected]);

  return (
    <div className={styles.app}>
      <div className={styles.wrapper}>
        <h1 className={styles.page_title}>Weather in Capitals Worldwide</h1>

        <div className={styles.main}>
          <div className={styles.location}>
            <select value={selected} onChange={updateState}>
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

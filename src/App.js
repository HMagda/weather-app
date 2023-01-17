import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles/styles.module.scss';

const App = () => {
  const [capitals, setCapitals] = useState(null);
  const [selected, setSelected] = useState('');
  const [data, setData] = useState({});
  const [scale, setScale] = useState('K');
  const [feltTemp, setFeltTemp] = useState('');

  useEffect(() => {
    // todo: if nothing selected then do nothing
    fetch('http://localhost:5000/countries_with_capitals')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCapitals(data);
      });
  }, []);

  const updateState = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    let selected_arr = [];
    selected_arr = selected.split(',');
    let selectedCity = selected_arr[0];
    selectedCity = encodeURIComponent(selectedCity);
    const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${process.env.REACT_APP_API_KEY}`;

    axios.get(api_url).then((res) => {
      setData(res.data);
    });
  }, [selected]);

  const handleChangeScale = (e) => {
    setScale(e.target.value);
  };

  function roundNumber(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  useEffect(() => {
    let baseFeltTemp = 0.0;
    if (Object.keys(data).length !== 0) {
      baseFeltTemp = data.main.feels_like;
    }
    
    if (scale === 'C') {
      let KelvinToCelsius = roundNumber(baseFeltTemp - 273.15);
      setFeltTemp(KelvinToCelsius);
    } else if (scale === 'F') {
      let KelvinToFahrenheit = roundNumber(1.8 * (baseFeltTemp - 273.15) + 32);
      setFeltTemp(KelvinToFahrenheit);
    } else {
      setFeltTemp(baseFeltTemp);
    }
  });

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
                capitals.map((elem, i) => {
                  if (i === 0) {
                    return (
                      <option hidden key={i}>
                        Click here to choose the capital city
                      </option>
                    );
                  } else {
                    return (
                      <option key={i}>
                        {elem.city}, {elem.country}
                      </option>
                    );
                  }
                })}
                
            </select>
            <p>
              {selected ? selected : 'Click above to choose the capital city'}
            </p>
          </div>
        </div>

        {Object.keys(data).length !== 0 && (
          <>
            <div className={styles.temperature}>
              <p className={styles.value}>{data.main.temp}</p>
            </div>
            <div className={styles.addition}>
              <div className={styles.container}>
                <h2>feels like</h2>

                {feltTemp === '' ? (
                  <p className={styles.value}>{data.main.feels_like}</p>
                ) : (
                  <p className={styles.value}>{feltTemp}</p>
                )}

                <select
                  value={scale}
                  onChange={handleChangeScale}
                  className={styles.scale_select}
                >
                  <option value='K'>K</option>
                  <option value='C'>&deg;C</option>
                  <option value='F'>&deg;F</option>
                </select>
              </div>
              <div className={styles.container}>
                <h2>wind speed</h2>
                <p className={styles.value}>
                  {data.wind.speed}
                  &nbsp;m/sec
                </p>
              </div>
              <div className={styles.container}>
                <h2>cloudiness</h2>
                <p className={styles.value}>{data.clouds.all}%</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './styles/styles.module.scss';

interface Capital {
  city: string;
  country: string;
}

interface Weather {
  clouds: {
    all: number;
  };
  main: {
    feels_like: number;
    temp: number;
  };
  wind: {
    speed: number;
  };
}

const App: React.FC = () => {
  const [capitals, setCapitals] = useState<Capital[] | null>(null);
  const [selected, setSelected] = useState<string>('');
  const [data, setData] = useState<Weather>({
    clouds: {all: 0},
    main: {feels_like: 0, temp: 0},
    wind: {speed: 0},
  });
  const [scale, setScale] = useState<string>('K');
  const [feltTemp, setFeltTemp] = useState<number | string>('');
  const [actualTemp, setActualTemp] = useState<number | string>('');

  useEffect(() => {
    fetch('http://localhost:5000/countries_with_capitals')
      .then((res) => {
        return res.json();
      })
      .then((data: Capital[]) => {
        setCapitals(data);
      });
  }, []);

  const updateState = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    let selected_arr: string[] = [];
    selected_arr = selected.split(',');
    let selectedCity: string = selected_arr[0];
    selectedCity = encodeURIComponent(selectedCity);
    const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${process.env.REACT_APP_API_KEY}`;

    axios.get(api_url).then((res) => {
      setData(res.data);
    });
  }, [selected]);

  const handleChangeScale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(e.target.value);
  };

  useEffect(() => {
    function roundNumber(num: number): number {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    function convertKelvinToCelsius(temp: number): number {
      return roundNumber(temp - 273.15);
    }

    function convertKelvinToFahrenheit(temp: number): number {
      return roundNumber(1.8 * (temp - 273.15) + 32);
    }

    let baseFeltTemp: number = 0.0;
    let baseActualTemp: number = 0.0;

    if (Object.keys(data).length !== 0) {
      baseFeltTemp = data.main.feels_like;
      baseActualTemp = data.main.temp;
    }

    if (scale === 'C') {
      setFeltTemp(convertKelvinToCelsius(baseFeltTemp));
      setActualTemp(convertKelvinToCelsius(baseActualTemp));
    } else if (scale === 'F') {
      setFeltTemp(convertKelvinToFahrenheit(baseFeltTemp));
      setActualTemp(convertKelvinToFahrenheit(baseActualTemp));
    } else {
      setFeltTemp(baseFeltTemp);
      setActualTemp(baseActualTemp);
    }
  }, [data, scale]);

  return (
    <div
      className={
        typeof data.clouds != 'undefined'
          ? data.clouds.all < 20
            ? styles.clear_sky
            : data.clouds.all < 60
            ? styles.partly_cloudy
            : styles.app
          : styles.app
      }
    >
      <main>
        <div className={styles.wrapper}>
          <h1 className={styles.page_title}>Weather in Capitals Worldwide</h1>

          <div className={styles.location}>
            <select
              value={selected}
              onChange={updateState}
              className={styles.select_location}
            >
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

          {Object.keys(data).length !== 0 && (
            <>
              <div className={styles.temperature}>
                {actualTemp === '' ? (
                  <p className={styles.value}>{data.main.temp}</p>
                ) : (
                  <p className={styles.value}>{actualTemp}</p>
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

              <div className={styles.addition}>
                <div className={styles.container}>
                  <h2>feels like</h2>

                  <div className={styles.felt_temperature}>
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
      </main>
    </div>
  );
};

export default App;

import styles from "./App.module.css";
import Form from "./components/Form/Form";
import Spinner from "./components/Spinner/spinner";
import WeatherDetail from "./components/WeatherDetail/WeatherDetail";
import useWeather from "./hooks/useWeather";
import Alert from "./components/Alert/Alert";

function App() {
  const { notFound, loading, fetchWeather, weather, hasWeatherData } =
    useWeather();

  return (
    <>
      <h1 className={styles.title}>Buscador de clima</h1>

      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />
        {loading && <Spinner />}
        {!loading && hasWeatherData && <WeatherDetail weather={weather} />}
        {notFound && <Alert>Sin resultados</Alert>}
      </div>
    </>
  );
}

export default App;

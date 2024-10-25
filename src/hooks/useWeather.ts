import { SearchType } from "../types";

export default function useWeather() {
  async function fetchWeather({ city, country }: SearchType) {
    try {
      let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=${
        import.meta.env.VITE_API_KEY
      }`;
      let response = await fetch(url);
      if (!response.ok) {
        // Check if the response is successful
        throw new Error("La respuesta de la red no es correcta");
      }
      const latlonData = (await response.json())[0]; // Parse the JSON data
      console.log(latlonData);

      if (latlonData === undefined) {
        throw new Error("Sin resultados");
      }
      if (
        "lat" in latlonData &&
        !isNaN(latlonData["lat"]) &&
        "lon" in latlonData &&
        !isNaN(latlonData["lon"])
      ) {
        console.log("lat, lon");
      } else {
        throw new Error("Datos incompletos longitud y latitud");
      }

      url = `https://api.openweathermap.org/data/2.5/weather?lat=${
        latlonData.lat
      }&lon=${latlonData.lon}&appid=${import.meta.env.VITE_API_KEY}`;

      response = await fetch(url);
      if (!response.ok) {
        // Check if the response is successful
        throw new Error("La respuesta de la red no es correcta");
      }

      const weatherResult = await response.json(); // Parse the JSON data
      console.log(weatherResult);

      if (weatherResult === undefined) {
        throw new Error("Sin resultados");
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Fin de la consulta");
    }
  }

  return {
    fetchWeather,
  };
}

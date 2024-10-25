import { SearchType } from "../types";
import { z } from "zod";

export default function useWeather() {
  //TYPE GUARD AND ASSERTION
  //   function isWeatherResponse(weather: unknown) {
  //     return (
  //       Boolean(weather) &&
  //       typeof weather === "object" &&
  //       typeof (weather as Weather).name === "string" &&
  //       typeof (weather as Weather).main.temp === "number" &&
  //       typeof (weather as Weather).main.temp_max === "number" &&
  //       typeof (weather as Weather).main.temp_min === "number"
  //     );
  //   }

  const WeatherSchema = z.object({
    name: z.string(),
    main: z.object({
      temp: z.number(),
      temp_max: z.number(),
      temp_min: z.number(),
    }),
  });

  //   type Weather = z.infer<typeof WeatherSchema>;

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

      const data = await response.json(); // Parse the JSON data
      const weatherResult = WeatherSchema.safeParse(data);
      //   if (!isWeatherResponse(weatherResult)) {
      //     throw new Error("Datos de tiempo no son válidos");
      //   }

      //   if (weatherResult === undefined) {
      //     throw new Error("Sin resultados");
      //   }

      if (!weatherResult.success) {
        throw new Error("El segundo resultado no fue exitoso");
      }
      console.log(weatherResult.data);
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

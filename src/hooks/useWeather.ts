//import { number, object, string, InferOutput, parse } from "valibot";
import { SearchType } from "../types";
import { useMemo, useState } from "react";
import { z } from "zod";

// //Zod
const WeatherSchema = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});

export type Weather = z.infer<typeof WeatherSchema>;

//con valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number(),
//   }),
// });

// type Weather = InferOutput<typeof WeatherSchema>;
const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

export default function useWeather() {
  const [weather, setWeather] = useState<Weather>(initialState);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

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

  async function fetchWeather({ city, country }: SearchType) {
    try {
      setLoading(true);
      setWeather(initialState);

      let url = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=${
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
      //zod
      const weatherResult = WeatherSchema.safeParse(data);

      //valibot
      // const weatherResult = parse(WeatherSchema, data);
      // console.log(weatherResult);

      // type guard
      //   if (!isWeatherResponse(weatherResult)) {
      //     throw new Error("Datos de tiempo no son válidos");
      //   }

      if (weatherResult === undefined) {
        throw new Error("Sin resultados");
      }

      if (!weatherResult.success) {
        throw new Error("El segundo resultado no fue exitoso");
      }
      console.log(weatherResult.data);
      setNotFound(false);
      setWeather(weatherResult.data);
    } catch (error) {
      console.log(error);
      setNotFound(true);
    } finally {
      console.log("Fin de la consulta");
      setLoading(false);
    }
  }

  const hasWeatherData = useMemo(() => weather.name, [weather]);
  console.log({
    hasWeatherData,
  });
  return {
    fetchWeather,
    weather,
    hasWeatherData,
    loading,
    notFound,
  };
}

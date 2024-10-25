import { countries } from "../../data/countries";
import { SearchType } from "../../types";
import Alert from "../Alert/Alert";
import styles from "./Form.module.css";
import { ChangeEvent, FormEvent, useState } from "react";

export type FormProps = {
  fetchWeather: ({ city, country }: SearchType) => void;
};
export default function Form({ fetchWeather }: FormProps) {
  const [search, setSearch] = useState<SearchType>({
    city: "",
    country: "",
  });

  const [alert, setAlert] = useState<string>("");

  function handleChange(
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ): void {
    setSearch({
      ...search,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    let alertMessage = "";
    if (Object.values(search).includes("")) {
      alertMessage = "Todos los campos son obligatorios";
    } else {
      console.log("ok");
    }

    fetchWeather(search);

    setAlert(alertMessage);
  }

  return (
    <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
      {alert.length > 0 && <Alert>{alert}</Alert>}
      <div className={styles.field}>
        <label htmlFor="city">Ciudad:</label>
        <input
          id="city"
          type="text"
          name="city"
          placeholder="Ciudad"
          value={search.city}
          onChange={(event) => handleChange(event)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="country">Pais:</label>
        <select
          id="country"
          name="country"
          value={search.country}
          onChange={(event) => handleChange(event)}
        >
          <option value="" className={styles.option}>
            -- Seleccione un País ---
          </option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <input className={styles.submit} type="submit" value="Consultar Clima" />
    </form>
  );
}

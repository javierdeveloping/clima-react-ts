// import styles from "./spinner.module.css";
//mejores de performnace de modulos puede dar problema de renderizar las clases
import "./spinner.css";
export default function Spinner() {
  return (
    <div className="spinner">
      <div className="cube1"></div>
      <div className="cube2"></div>
    </div>
  );
}

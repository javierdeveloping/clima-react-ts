import { ReactNode } from "react";
import styles from "./Alert.module.css";

export type AlertProps = {
  children: ReactNode;
};
export default function Alert({ children }: AlertProps) {
  return <div className={styles.alert}>{children}</div>;
}

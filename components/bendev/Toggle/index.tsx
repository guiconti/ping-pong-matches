import { HTMLProps, InputHTMLAttributes } from "react";
import styles from "./Toggle.module.scss";

export default function Toggle({
  ...rest
}: HTMLProps<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className={styles.toggle} {...rest} />;
}

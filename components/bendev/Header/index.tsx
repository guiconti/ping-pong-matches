import { PropsWithChildren } from "react";
import cx from "classnames";
import styles from "./Header.module.scss";

export type HeaderProps = {
  align?: "left" | "center" | "right";
  className?: string;
};

export default function Header({
  align = "center",
  className,
  children,
  ...rest
}: PropsWithChildren<HeaderProps>) {
  return (
    <h1 className={cx(styles.header, className, styles[align])} {...rest}>
      {children}
    </h1>
  );
}

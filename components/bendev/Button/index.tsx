import { HTMLProps, ButtonHTMLAttributes, PropsWithChildren } from "react";
import cx from "classnames";

import styles from "./Button.module.scss";

export type ButtonProps = {
  transparent?: boolean;
  destructive?: boolean;
  wide?: boolean;
};

export default function Button({
  transparent,
  destructive,
  wide,
  children,
  className,
  ...rest
}: PropsWithChildren<
  ButtonProps &
    HTMLProps<HTMLButtonElement> &
    ButtonHTMLAttributes<HTMLButtonElement>
>) {
  return (
    <button
      className={cx(styles.button, className, {
        [styles.transparent]: transparent,
        [styles.destructive]: destructive,
        [styles.wide]: wide,
      })}
      {...rest}
    >
      {children}
    </button>
  );
}

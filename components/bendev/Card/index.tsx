import { PropsWithChildren } from "react";
import cx from "classnames";
import styles from "./Card.module.scss";

interface CardProps {
  onClick?(): void;
  className?: string;
}

export default function Card({
  onClick,
  className,
  children,
}: PropsWithChildren<CardProps>) {
  return (
    <article
      className={cx(styles.wrapper, className, {
        [styles.clickable]: Boolean(onClick),
      })}
      onClick={onClick}
    >
      {children}
    </article>
  );
}

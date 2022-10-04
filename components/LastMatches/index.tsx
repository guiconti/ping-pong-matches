import { useMemo } from "react";
import cx from "classnames";
import { Match } from "@/types";
import styles from "./LastMatches.module.scss";

interface LastMatchesProps {
  teamId: string;
  matches: Array<Match>;
  amount?: number;
}

export default function LastMatches({
  teamId,
  matches: sentMatches,
  amount = 5,
}: LastMatchesProps) {
  const matches = useMemo(() => {
    let matchesToRender = sentMatches.slice(0, amount);
    if (matchesToRender.length < amount) {
      matchesToRender = matchesToRender.concat(
        Array(amount - matchesToRender.length).fill(undefined)
      );
    }
    return matchesToRender;
  }, [sentMatches, amount]);

  return (
    <p className={styles.wrapper}>
      Last {amount}:
      {matches.map((match, index) => (
        <span
          key={index}
          className={cx({
            [styles.win]: match && match.teamWonId === teamId,
            [styles.loss]: match && match.teamWonId !== teamId,
          })}
        />
      ))}
    </p>
  );
}

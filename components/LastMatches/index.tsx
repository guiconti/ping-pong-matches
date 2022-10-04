import { useMemo } from "react";
import cx from "classnames";
import { Match } from "@/types";
import styles from "./LastMatches.module.scss";

interface LastMatchesProps {
  teamIds: string | string[];
  matches: Array<Match>;
  amount?: number;
}

export default function LastMatches({
  teamIds,
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
      Últimas {amount}:
      {matches.map((match, index) => (
        <span
          key={index}
          className={cx({
            [styles.win]: match && teamIds.includes(match.teamWonId),
            [styles.loss]: match && !teamIds.includes(match.teamWonId),
          })}
        />
      ))}
    </p>
  );
}

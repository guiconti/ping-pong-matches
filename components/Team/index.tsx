import cx from "classnames";
import { Team as TeamType } from "@/types";
import Card from "@/components/bendev/Card";
import LastMatches from "@/components/LastMatches";
import { FaStar } from "react-icons/fa";
import styles from "./Team.module.scss";

interface TeamProps {
  team: TeamType;
  onClick?(): void;
  winner?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export default function Team({
  team,
  onClick,
  winner,
  selected,
  disabled,
}: TeamProps) {
  return (
    <Card
      className={cx(styles.wrapper, {
        [styles.selected]: selected,
        [styles.disabled]: disabled,
      })}
      onClick={onClick}
    >
      <div className={styles.names}>
        <span>{team.playerA.name}</span> e <span>{team.playerB.name}</span>
      </div>
      <div className={styles.statuses}>
        <p>
          Vitórias: <strong>{team.wins}</strong>
        </p>
        <p>
          Derrotas: <strong>{team.losses}</strong>
        </p>
        <LastMatches teamId={team.id} matches={team.matches} amount={5} />
      </div>
      {winner && (
        <span className={styles.star}>
          <FaStar />
        </span>
      )}
    </Card>
  );
}

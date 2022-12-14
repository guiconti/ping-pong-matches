import { useMemo } from "react";
import cx from "classnames";
import { FaCheckCircle } from "react-icons/fa";
import Card from "@/components/bendev/Card";
import LastMatches from "@/components/LastMatches";
import PlayerType from "@/types/player";
import styles from "./Player.module.scss";

interface PlayerProps {
  player: PlayerType;
  expanded?: boolean;
  selected?: boolean;
  onClick?(): void;
  className?: string;
}

export default function Player({
  player,
  expanded,
  selected,
  onClick,
  className,
}: PlayerProps) {
  return (
    <Card
      className={cx(styles.wrapper, className, { [styles.expanded]: expanded })}
      onClick={onClick}
    >
      <h4>{player.name}</h4>
      {expanded && (
        <div className={styles.statuses}>
          <p>
            Vitórias: <strong>{player.wins}</strong>
          </p>
          <p>
            Derrotas: <strong>{player.losses}</strong>
          </p>
          {player.matches && player.matches.length > 0 && (
            <LastMatches
              teamIds={player.teams}
              matches={player.matches}
              amount={5}
            />
          )}
        </div>
      )}
      {selected && <FaCheckCircle className={styles.check} />}
    </Card>
  );
}

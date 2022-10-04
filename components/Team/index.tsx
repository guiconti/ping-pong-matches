import { Team as TeamType } from "@/types";
import Card from "@/components/bendev/Card";
import LastMatches from "@/components/LastMatches";
import { FaStar } from "react-icons/fa";
import styles from "./Team.module.scss";

interface TeamProps {
  team: TeamType;
  onClick?(): void;
  winner?: boolean;
}

export default function Team({ team, onClick, winner }: TeamProps) {
  return (
    <Card className={styles.wrapper} onClick={onClick}>
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

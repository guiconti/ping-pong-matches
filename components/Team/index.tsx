import { Team as TeamType } from "@/types";
import Card from "@/components/bendev/Card";
import LastMatches from "@/components/LastMatches";
import styles from "./Team.module.scss";

interface TeamProps {
  team: TeamType;
  onClick?(): void;
}

export default function Team({ team, onClick }: TeamProps) {
  return (
    <Card className={styles.wrapper} onClick={onClick}>
      <div className={styles.names}>
        <span>{team.playerA.name}</span> e <span>{team.playerB.name}</span>
      </div>
      <div className={styles.statuses}>
        <p>
          Wins: <strong>{team.wins}</strong>
        </p>
        <p>
          Losses: <strong>{team.losses}</strong>
        </p>
        <LastMatches teamId={team.id} matches={team.matches} amount={5} />
      </div>
    </Card>
  );
}

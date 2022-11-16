import { useCallback, useMemo } from "react";
import { Team as TeamType } from "@/types";
import Team from "@/components/Team";
import styles from "./Match.module.scss";

interface MatchProps {
  teamA: TeamType;
  teamB: TeamType;
  onMatchFinish?(winnerTeam: TeamType): void;
  winnerId?: string;
  createdAt?: string;
}

export default function Match({
  teamA,
  teamB,
  onMatchFinish,
  winnerId,
  createdAt,
}: MatchProps) {
  const onTeamAWins = useCallback(() => {
    if (!onMatchFinish) return;
    onMatchFinish(teamA);
  }, [onMatchFinish, teamA]);

  const onTeamBWins = useCallback(() => {
    if (!onMatchFinish) return;
    onMatchFinish(teamB);
  }, [onMatchFinish, teamB]);

  const matchDate = useMemo(() => {
    if (!createdAt) return null;
    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  }, [createdAt]);

  return (
    <section className={styles.wrapper}>
      <Team
        team={teamA}
        onClick={onMatchFinish ? onTeamAWins : undefined}
        winner={winnerId === teamA.id}
      />
      <div>
        {matchDate && <span className={styles.date}>{matchDate}</span>}
        <span className={styles.versus}>Vs</span>
      </div>
      <Team
        team={teamB}
        onClick={onMatchFinish ? onTeamBWins : undefined}
        winner={winnerId === teamB.id}
      />
    </section>
  );
}

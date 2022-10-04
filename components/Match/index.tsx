import { useCallback } from "react";
import { Team as TeamType } from "@/types";
import Team from "@/components/Team";
import styles from "./Match.module.scss";

interface MatchProps {
  teamA: TeamType;
  teamB: TeamType;
  onMatchFinish(winnerTeam: TeamType): void;
}

export default function Match({ teamA, teamB, onMatchFinish }: MatchProps) {
  const onTeamAWins = useCallback(() => {
    onMatchFinish(teamA);
  }, [onMatchFinish, teamA]);

  const onTeamBWins = useCallback(() => {
    onMatchFinish(teamB);
  }, [onMatchFinish, teamB]);

  return (
    <section className={styles.wrapper}>
      <Team team={teamA} onClick={onTeamAWins} />
      <span>Vs</span>
      <Team team={teamB} onClick={onTeamBWins} />
    </section>
  );
}

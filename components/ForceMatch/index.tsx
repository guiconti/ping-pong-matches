import { useState, useCallback } from "react";
import { Team as TeamType, Match } from "@/types";
import Button from "@/components/bendev/Button";
import Team from "@/components/Team";
import styles from "./ForceMatch.module.scss";

interface ForceMatchProps {
  teams: Array<TeamType>;
  onMatchChosen(match: Match): void;
  onCancel(): void;
}

export default function ForceMatch({
  teams,
  onMatchChosen,
  onCancel,
}: ForceMatchProps) {
  const [selectedTeamA, setSelectedTeamA] = useState<TeamType>();
  const [selectedTeamB, setSelectedTeamB] = useState<TeamType>();

  const onSelectTeamA = useCallback(
    (team: TeamType) => {
      if (!selectedTeamB) {
        setSelectedTeamA(team);
        return;
      }
      const newMatch = {
        teamA: team,
        teamB: selectedTeamB,
      };
      onMatchChosen(newMatch);
    },
    [selectedTeamB, onMatchChosen]
  );

  const onSelectTeamB = useCallback(
    (team: TeamType) => {
      if (!selectedTeamA) {
        setSelectedTeamB(team);
        return;
      }
      const newMatch = {
        teamA: selectedTeamA,
        teamB: team,
      };
      onMatchChosen(newMatch);
    },
    [selectedTeamA, onMatchChosen]
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.teamsList}>
        {teams.map((team) => (
          <Team
            key={team.id}
            team={team}
            onClick={() => onSelectTeamA(team)}
            selected={selectedTeamA && team.id === selectedTeamA.id}
          />
        ))}
      </div>
      <div className={styles.teamsList}>
        {teams.map((team) => (
          <Team
            key={team.id}
            team={team}
            onClick={() => onSelectTeamB(team)}
            selected={selectedTeamB && team.id === selectedTeamB.id}
          />
        ))}
      </div>
    </section>
  );
}

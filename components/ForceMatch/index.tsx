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

function areValidTeamsForMatch(teamA: TeamType, teamB: TeamType) {
  return (
    teamA.playerA.id !== teamB.playerA.id &&
    teamA.playerA.id !== teamB.playerB.id &&
    teamA.playerB.id !== teamB.playerA.id &&
    teamA.playerB.id !== teamB.playerB.id
  );
}

export default function ForceMatch({
  teams,
  onMatchChosen,
  onCancel,
}: ForceMatchProps) {
  const [selectedTeamA, setSelectedTeamA] = useState<TeamType>();
  const [selectedTeamB, setSelectedTeamB] = useState<TeamType>();

  const generateMatch = useCallback(
    (teamA: TeamType, teamB: TeamType) => {
      onMatchChosen({ teamA, teamB });
    },
    [onMatchChosen]
  );

  const onSelectTeamA = useCallback(
    (team: TeamType) => {
      if (!selectedTeamB) {
        if (selectedTeamA && selectedTeamA.id === team.id) {
          setSelectedTeamA(undefined);
        } else {
          setSelectedTeamA(team);
        }
        return;
      }
      if (!areValidTeamsForMatch(team, selectedTeamB)) return;
      generateMatch(team, selectedTeamB);
    },
    [selectedTeamA, selectedTeamB, generateMatch]
  );

  const onSelectTeamB = useCallback(
    (team: TeamType) => {
      if (!selectedTeamA) {
        if (selectedTeamB && selectedTeamB.id === team.id) {
          setSelectedTeamB(undefined);
        } else {
          setSelectedTeamB(team);
        }
        return;
      }
      if (!areValidTeamsForMatch(selectedTeamA, team)) return;
      generateMatch(selectedTeamA, team);
    },
    [selectedTeamB, selectedTeamA, generateMatch]
  );

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.team}>
          <h3>Team A</h3>
          <div className={styles.teamsList}>
            {teams.map((team) => (
              <Team
                key={team.id}
                team={team}
                onClick={() => onSelectTeamA(team)}
                selected={selectedTeamA && team.id === selectedTeamA.id}
                disabled={
                  selectedTeamB &&
                  (selectedTeamB.playerA.id === team.playerA.id ||
                    selectedTeamB.playerA.id === team.playerB.id ||
                    selectedTeamB.playerB.id === team.playerA.id ||
                    selectedTeamB.playerB.id === team.playerB.id)
                }
              />
            ))}
          </div>
        </div>
        <div className={styles.team}>
          <h3>Team B</h3>
          <div className={styles.teamsList}>
            {teams.map((team) => (
              <Team
                key={team.id}
                team={team}
                onClick={() => onSelectTeamB(team)}
                selected={selectedTeamB && team.id === selectedTeamB.id}
                disabled={
                  selectedTeamA &&
                  (selectedTeamA.playerA.id === team.playerA.id ||
                    selectedTeamA.playerA.id === team.playerB.id ||
                    selectedTeamA.playerB.id === team.playerA.id ||
                    selectedTeamA.playerB.id === team.playerB.id)
                }
              />
            ))}
          </div>
        </div>
      </section>
      <Button destructive className={styles.cancelButton} onClick={onCancel}>
        Cancelar
      </Button>
    </>
  );
}

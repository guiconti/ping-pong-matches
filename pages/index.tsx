import { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import cx from "classnames";
import MatchesSetup from "@/components/MatchesSetup";
import Match from "@/components/Match";
import Button from "@/components/bendev/Button";
import ForceMatch from "@/components/ForceMatch";
import type { Player, Team, Match as MatchType } from "@/types";
import styles from "./Home.module.scss";

export async function getServerSideProps() {
  const playersResult = await fetch("http://127.0.0.1:8080/v1/players");
  const playersData = await playersResult.json();
  const players = playersData.data;
  const teamsResult = await fetch("http://127.0.0.1:8080/v1/teams");
  const teamsData = await teamsResult.json();
  const teams = teamsData.data;
  const matchesResult = await fetch(
    "http://127.0.0.1:8080/v1/matches?limit=5&includeFullMatches=true"
  );
  const matchesData = await matchesResult.json();
  const matches = matchesData.data.slice(0, 5);
  return {
    props: { players, teams, matches },
  };
}

interface HomeProps {
  players: Array<Player>;
  teams: Array<Team>;
  matches: Array<MatchType>;
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const Home: NextPage<HomeProps> = ({ players, teams, matches }: HomeProps) => {
  const [activePlayers, setActivePlayers] = useState<Array<Player>>([]);
  const [teamsDictionary, setTeamsDictionary] = useState<{
    [key: string]: Team;
  }>({});
  const [currentMatch, setCurrentMatch] = useState<MatchType>();
  const [matchesHistory, setMatchHistory] = useState<MatchType>(matches);
  const [forcingMatch, setForcingMatch] = useState<boolean>(false);

  useEffect(() => {
    const newTeamsDictionary: { [key: string]: Team } = {};
    teams.forEach((team) => {
      newTeamsDictionary[`${team.playerA.id}-${team.playerB.id}`] = team;
      newTeamsDictionary[`${team.playerB.id}-${team.playerA.id}`] = team;
    });
    setTeamsDictionary(newTeamsDictionary);
  }, [teams]);

  useEffect(() => {
    if (activePlayers.length < 4) return;
    onPickNextMatch();
  }, [activePlayers]);

  const onPickNextMatch = useCallback(
    (winnerTeam?: Team) => {
      if (activePlayers.length < 4) return;
      let playerAIdTeamA;
      let playerBIdTeamA;
      let playerAIdTeamB;
      let playerBIdTeamB;
      if (winnerTeam) {
        if (Math.random() >= 0.5) {
          playerAIdTeamA = winnerTeam.playerA.id;
          playerAIdTeamB = winnerTeam.playerB.id;
        } else {
          playerAIdTeamA = winnerTeam.playerB.id;
          playerAIdTeamB = winnerTeam.playerA.id;
        }
      }

      let playersThatWontBePicked: Array<string> = [];
      // TODO: We should have a queue so we can handle more than 6 players
      // Correctly
      if (currentMatch) {
        const playersInCurrentMatch = [
          currentMatch.teamA.playerA.id,
          currentMatch.teamA.playerB.id,
          currentMatch.teamB.playerA.id,
          currentMatch.teamB.playerB.id,
        ];
        if (activePlayers.length >= 6) {
          playersThatWontBePicked = playersInCurrentMatch;
        } else {
          playersThatWontBePicked = [
            winnerTeam.playerA.id,
            winnerTeam.playerB.id,
          ];
          // We should check who was in the previous match, they should leave
          if (activePlayers.length === 5) {
            const looserTeam =
              currentMatch.teamA.playerA.id === winnerTeam.playerA.id ||
              currentMatch.teamA.playerB.id === winnerTeam.playerA.id
                ? currentMatch.teamB
                : currentMatch.teamA;
            if (matchesHistory.length === 0) {
              if (Math.random() >= 0.5) {
                playersThatWontBePicked.push(looserTeam.playerA.id);
              } else {
                playersThatWontBePicked.push(looserTeam.playerB.id);
              }
            } else {
              const lastMatch = matchesHistory[0];
              const lastMatchPlayers = [
                lastMatch.teamA.playerA.id,
                lastMatch.teamA.playerB.id,
                lastMatch.teamB.playerA.id,
                lastMatch.teamB.playerB.id,
              ];
              if (lastMatchPlayers.includes(looserTeam.playerA.id)) {
                // If they were both in the last match
                if (lastMatchPlayers.includes(looserTeam.playerB.id)) {
                  const lastMatchTeamLooser =
                    lastMatch.teamWonId === lastMatch.teamA.id
                      ? lastMatch.teamB
                      : lastMatch.teamA;
                  const playerAAlsoLostLastOne =
                    looserTeam.playerA.id === lastMatchTeamLooser.playerA.id ||
                    looserTeam.playerA.id === lastMatchTeamLooser.playerB.id;
                  const playerBAlsoLostLastOne =
                    looserTeam.playerB.id === lastMatchTeamLooser.playerA.id ||
                    looserTeam.playerB.id === lastMatchTeamLooser.playerB.id;
                  if (playerAAlsoLostLastOne && !playerBAlsoLostLastOne) {
                    playersThatWontBePicked.push(looserTeam.playerA.id);
                  } else if (
                    !playerAAlsoLostLastOne &&
                    playerBAlsoLostLastOne
                  ) {
                    playersThatWontBePicked.push(looserTeam.playerB.id);
                    // If they both lost the last match then we pick one randomly
                  } else {
                    if (Math.random() >= 0.5) {
                      playersThatWontBePicked.push(looserTeam.playerA.id);
                    } else {
                      playersThatWontBePicked.push(looserTeam.playerB.id);
                    }
                  }
                } else {
                  playersThatWontBePicked.push(looserTeam.playerA.id);
                }
              } else {
                playersThatWontBePicked.push(looserTeam.playerB.id);
              }
            }
          }
        }
      }
      const possiblePlayers = activePlayers.filter(
        (player) => !playersThatWontBePicked.includes(player.id)
      );
      console.log(possiblePlayers);
      if (!playerAIdTeamA) {
        playerAIdTeamA = possiblePlayers.splice(
          randomIntFromInterval(0, possiblePlayers.length - 1),
          1
        )[0].id;
      }
      if (!playerAIdTeamB) {
        playerAIdTeamB = possiblePlayers.splice(
          randomIntFromInterval(0, possiblePlayers.length - 1),
          1
        )[0].id;
      }
      playerBIdTeamA = possiblePlayers.splice(
        randomIntFromInterval(0, possiblePlayers.length - 1),
        1
      )[0].id;
      playerBIdTeamB = possiblePlayers.splice(
        randomIntFromInterval(0, possiblePlayers.length - 1),
        1
      )[0].id;
      let teamA = teamsDictionary[`${playerAIdTeamA}-${playerBIdTeamA}`];
      let teamB = teamsDictionary[`${playerAIdTeamB}-${playerBIdTeamB}`];
      // TODO: It would be good to support checking for alternate teams even if it is the first match
      if (currentMatch) {
        const teamAMatches = teamA.wins + teamA.losses;
        const teamBMatches = teamB.wins + teamB.losses;
        const alternateTeamA =
          teamsDictionary[`${playerAIdTeamA}-${playerBIdTeamB}`];
        const alternateTeamB =
          teamsDictionary[`${playerAIdTeamB}-${playerBIdTeamA}`];
        const alternateTeamAMatches =
          alternateTeamA.wins + alternateTeamA.losses;
        const alternateTeamBMatches =
          alternateTeamB.wins + alternateTeamB.losses;
        if (
          alternateTeamAMatches + alternateTeamBMatches <
          teamAMatches + teamBMatches
        ) {
          teamA = alternateTeamA;
          teamB = alternateTeamB;
        }
      }
      const newMatch = {
        teamA,
        teamB,
      };
      setCurrentMatch(newMatch);
    },
    [activePlayers, matchesHistory, currentMatch, teamsDictionary]
  );

  const onMatchFinish = useCallback(
    (winnerTeam: Team) => {
      if (!currentMatch) return;
      const newTeamsDictionary = { ...teamsDictionary };
      const matchData = {
        teamAId: currentMatch.teamA.id,
        teamBId: currentMatch.teamB.id,
        teamWonId: winnerTeam.id,
      };
      let teamA, teamB;
      if (
        winnerTeam.playerA.id !== currentMatch.teamA.playerA.id &&
        winnerTeam.playerA.id !== currentMatch.teamA.playerB.id
      ) {
        const newTeam =
          newTeamsDictionary[
            `${currentMatch.teamA.playerA.id}-${currentMatch.teamA.playerB.id}`
          ];
        newTeam.losses++;
        newTeam.matches = [matchData, ...newTeam.matches];
        newTeamsDictionary[
          `${currentMatch.teamA.playerA.id}-${currentMatch.teamA.playerB.id}`
        ] = newTeam;
        newTeamsDictionary[
          `${currentMatch.teamA.playerB.id}-${currentMatch.teamA.playerA.id}`
        ] = newTeam;
        teamA = newTeam;
      } else {
        const newTeam =
          newTeamsDictionary[
            `${currentMatch.teamB.playerA.id}-${currentMatch.teamB.playerB.id}`
          ];
        newTeam.losses++;
        newTeam.matches = [matchData, ...newTeam.matches];
        newTeamsDictionary[
          `${currentMatch.teamB.playerA.id}-${currentMatch.teamB.playerB.id}`
        ] = newTeam;
        newTeamsDictionary[
          `${currentMatch.teamB.playerB.id}-${currentMatch.teamB.playerA.id}`
        ] = newTeam;
        teamB = newTeam;
      }
      const newWinnerTeam =
        newTeamsDictionary[`${winnerTeam.playerA.id}-${winnerTeam.playerB.id}`];
      newWinnerTeam.wins++;
      newWinnerTeam.matches = [matchData, ...newWinnerTeam.matches];
      newTeamsDictionary[`${winnerTeam.playerA.id}-${winnerTeam.playerB.id}`] =
        newWinnerTeam;
      newTeamsDictionary[`${winnerTeam.playerB.id}-${winnerTeam.playerA.id}`] =
        newWinnerTeam;
      if (teamA) {
        teamB = newWinnerTeam;
      } else {
        teamA = newWinnerTeam;
      }
      setTeamsDictionary(newTeamsDictionary);
      const newMatchHistory = [
        {
          ...currentMatch,
          teamA,
          teamB,
          createdAt: new Date(),
          teamWonId: winnerTeam.id,
        },
        ...matchesHistory,
      ];
      setMatchHistory(newMatchHistory);
      onPickNextMatch(winnerTeam);
      fetch("http://127.0.0.1:8080/v1/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData),
      });
    },
    [matchesHistory, teamsDictionary, onPickNextMatch, currentMatch]
  );

  const onStartMatches = useCallback(
    (selectedPlayers: Array<Player>) => {
      setActivePlayers(selectedPlayers);
    },
    [onPickNextMatch]
  );

  const onDeleteLastMatch = useCallback(async () => {
    const deleteLastMatchResult = await fetch(
      "http://127.0.0.1:8080/v1/matches/last",
      { method: "DELETE" }
    );
    const deleteLastData = await deleteLastMatchResult.json();
    const deleted = deleteLastData.data;
    if (deleted <= 0 || matchesHistory.length === 0) return;
    const newMatchesHistory = [...matchesHistory];
    const newCurrentMatch = newMatchesHistory.splice(0, 1)[0];

    const teamA =
      teamsDictionary[
        `${newCurrentMatch.teamA.playerA.id}-${newCurrentMatch.teamA.playerB.id}`
      ];
    const teamB =
      teamsDictionary[
        `${newCurrentMatch.teamB.playerA.id}-${newCurrentMatch.teamB.playerB.id}`
      ];
    const teamAWinner = newCurrentMatch.teamWonId === teamA.id;

    if (teamAWinner) {
      teamA.wins--;
      teamB.losses--;
    } else {
      teamA.losses--;
      teamB.wins--;
    }

    const teamAMatches = [...teamA.matches];
    teamAMatches.splice(0, 1);
    teamA.matches = teamAMatches;
    const teamBMatches = [...teamB.matches];
    teamBMatches.splice(0, 1);
    teamB.matches = teamBMatches;
    const newTeamsDictionary = { ...teamsDictionary };
    newTeamsDictionary[
      `${newCurrentMatch.teamA.playerA.id}-${newCurrentMatch.teamA.playerB.id}`
    ] = {
      ...teamA,
    };
    newTeamsDictionary[
      `${newCurrentMatch.teamA.playerB.id}-${newCurrentMatch.teamA.playerA.id}`
    ] = {
      ...teamA,
    };
    newTeamsDictionary[
      `${newCurrentMatch.teamB.playerA.id}-${newCurrentMatch.teamB.playerB.id}`
    ] = {
      ...teamB,
    };
    newTeamsDictionary[
      `${newCurrentMatch.teamB.playerB.id}-${newCurrentMatch.teamB.playerA.id}`
    ] = {
      ...teamB,
    };

    newCurrentMatch.teamA = teamA;
    newCurrentMatch.teamB = teamB;
    newCurrentMatch.teamWonId = undefined;
    setCurrentMatch(newCurrentMatch);
    setMatchHistory(newMatchesHistory);
    setTeamsDictionary(newTeamsDictionary);
  }, [matchesHistory, teamsDictionary]);

  const onStartForceMatch = useCallback(() => {
    setForcingMatch(true);
  }, []);

  const onForceMatchChosen = useCallback((match: MatchType) => {
    setCurrentMatch(match);
    setForcingMatch(false);
  }, []);

  const onForceMatchCancel = useCallback(() => {
    setForcingMatch(false);
  }, []);

  return (
    <>
      {!currentMatch ? (
        <>
          <MatchesSetup players={players} onStartMatches={onStartMatches} />
          <div className={cx(styles.actions, styles.links)}>
            {/* These should be a Link button instead of a button wrapping a link */}
            <Link href="/teams">
              <Button>Ver times</Button>
            </Link>
            <Link href="/players">
              <Button>Ver players</Button>
            </Link>
          </div>
        </>
      ) : (
        <section className={styles.wrapper}>
          {forcingMatch ? (
            <ForceMatch
              teams={teams}
              onMatchChosen={onForceMatchChosen}
              onCancel={onForceMatchCancel}
            />
          ) : (
            <>
              <Match
                teamA={currentMatch.teamA}
                teamB={currentMatch.teamB}
                onMatchFinish={onMatchFinish}
              />
              <div className={styles.actions}>
                <Button onClick={onStartForceMatch}>Forçar partida</Button>
                {matchesHistory.length > 0 && (
                  <Button onClick={onDeleteLastMatch} destructive>
                    Refazer partida anterior
                  </Button>
                )}
              </div>
              {matchesHistory.length > 0 && (
                <div className={styles.previousMatches}>
                  <h2>Partidas anteriores</h2>
                  {matchesHistory.map((match: MatchType) => (
                    <Match
                      key={match.id || `${match.teamA.id}-${match.teamB.id}`}
                      teamA={match.teamA}
                      teamB={match.teamB}
                      winnerId={match.teamWonId}
                      createdAt={match.createdAt}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}
    </>
  );
};

export default Home;

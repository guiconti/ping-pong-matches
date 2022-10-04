import { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import MatchesSetup from "@/components/MatchesSetup";
import Match from "@/components/Match";
import Button from "@/components/bendev/Button";
import type { Player, Team, Match as MatchType } from "@/types";
import styles from "./Home.module.scss";

export async function getServerSideProps() {
  const playersResult = await fetch("http://127.0.0.1:8080/v1/players");
  const playersData = await playersResult.json();
  const players = playersData.data;
  const teamsResult = await fetch("http://127.0.0.1:8080/v1/teams");
  const teamsData = await teamsResult.json();
  const teams = teamsData.data;
  const matchesResult = await fetch("http://127.0.0.1:8080/v1/matches?limit=5");
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

  useEffect(() => {
    const newTeamsDictionary: { [key: string]: Team } = {};
    teams.forEach((team) => {
      newTeamsDictionary[`${team.playerA.id}-${team.playerB.id}`] = team;
      newTeamsDictionary[`${team.playerB.id}-${team.playerA.id}`] = team;
    });
    setTeamsDictionary(newTeamsDictionary);
  }, [teams]);

  const onForceNextMatch = useCallback((nextMatch: MatchType) => {
    setCurrentMatch(nextMatch);
  }, []);

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
                playersThatWontBePicked.push(looserTeam.playerA);
              } else {
                playersThatWontBePicked.push(looserTeam.playerB);
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
                playersThatWontBePicked.push(looserTeam.playerA.id);
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
      const newMatch = {
        teamA: teamsDictionary[`${playerAIdTeamA}-${playerBIdTeamA}`],
        teamB: teamsDictionary[`${playerAIdTeamB}-${playerBIdTeamB}`],
      };
      setCurrentMatch(newMatch);
    },
    [activePlayers, matchesHistory, currentMatch, teamsDictionary]
  );

  const onMatchFinish = useCallback(
    (winnerTeam: Team) => {
      if (!currentMatch) return;
      const newMatchHistory = [currentMatch, ...matchesHistory];
      setMatchHistory(newMatchHistory);
      const newTeamsDictionary = { ...teamsDictionary };
      const matchData = {
        teamAId: currentMatch.teamA.id,
        teamBId: currentMatch.teamB.id,
        teamWonId: winnerTeam.id,
      };
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
      }
      const newWinnerTeam =
        newTeamsDictionary[`${winnerTeam.playerA.id}-${winnerTeam.playerB.id}`];
      newWinnerTeam.wins++;
      newWinnerTeam.matches = [matchData, ...newWinnerTeam.matches];
      newTeamsDictionary[`${winnerTeam.playerA.id}-${winnerTeam.playerB.id}`] =
        newWinnerTeam;
      newTeamsDictionary[`${winnerTeam.playerB.id}-${winnerTeam.playerA.id}`] =
        newWinnerTeam;
      setTeamsDictionary(newTeamsDictionary);
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
      onPickNextMatch();
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
    const newCurrentMatch = newMatchesHistory.splice(0, 1);
    setCurrentMatch(newCurrentMatch);
  }, [matchesHistory]);

  return (
    <>
      {!currentMatch ? (
        <MatchesSetup players={players} onStartMatches={onStartMatches} />
      ) : (
        <section className={styles.wrapper}>
          <Match
            teamA={currentMatch.teamA}
            teamB={currentMatch.teamB}
            onMatchFinish={onMatchFinish}
          />
          {matchesHistory.length > 0 && (
            <Button onClick={onDeleteLastMatch} destructive>
              Undo last match
            </Button>
          )}
        </section>
      )}
    </>
  );
};

export default Home;

import { useState, useEffect, useCallback } from "react";
import type { Player as PlayerType } from "@/types";
import Player from "@/components/Player";
import Header from "@/components/bendev/Header";
import Button from "@/components/bendev/Button";
import styles from "./MatchesSetup.module.scss";

interface PlayerToggleProps {
  player: PlayerType;
  active: boolean;
  onTogglePlayer(playerId: string): void;
}

function PlayerToggle({ player, active, onTogglePlayer }: PlayerToggleProps) {
  const onToggle = useCallback(() => {
    onTogglePlayer(player.id);
  }, [player.id, onTogglePlayer]);

  return <Player player={player} selected={active} onClick={onToggle} />;
}

function generateState(players: Array<PlayerType>) {
  const newDictionary: {
    [key: string]: { player: PlayerType; active: boolean };
  } = {};
  players.forEach(
    (player) => (newDictionary[player.id] = { player, active: true })
  );
  return newDictionary;
}

interface MatchesSetupProps {
  players: Array<PlayerType>;
  onStartMatches(selectedPlayerrs: Array<PlayerType>): void;
}

export default function ActivePlayers({
  players,
  onStartMatches,
}: MatchesSetupProps) {
  const [possiblePlayers, setPossiblePlayers] = useState<{
    [key: string]: { player: PlayerType; active: boolean };
  }>(generateState(players));

  useEffect(() => {
    setPossiblePlayers(generateState(players));
  }, [players]);

  const togglePlayer = useCallback(
    (playerId: string) => {
      const newPossiblePlayers = { ...possiblePlayers };
      newPossiblePlayers[playerId].active = !possiblePlayers[playerId].active;
      setPossiblePlayers(newPossiblePlayers);
    },
    [possiblePlayers]
  );

  const onStart = useCallback(() => {
    const activePlayers: Array<PlayerType> = [];
    const ids: string[] = Object.keys(possiblePlayers);
    ids.forEach((playerId) => {
      if (!possiblePlayers[playerId].active) return;
      activePlayers.push(possiblePlayers[playerId].player);
    });
    onStartMatches(activePlayers);
  }, [possiblePlayers, onStartMatches]);

  return (
    <section className={styles.wrapper}>
      <Header>Jogadores presentes</Header>
      <div className={styles.players}>
        {players.map((player) => (
          <PlayerToggle
            key={player.id}
            player={player}
            active={possiblePlayers[player.id].active}
            onTogglePlayer={togglePlayer}
          />
        ))}
      </div>
      <Button className={styles.startButton} onClick={onStart}>
        Começar
      </Button>
    </section>
  );
}

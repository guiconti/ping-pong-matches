import { useState, useEffect, useCallback } from "react";
import type { Player } from "@/types";
import Header from "@/components/bendev/Header";
import Toggle from "@/components/bendev/Toggle";
import Button from "@/components/bendev/Button";
import styles from "./MatchesSetup.module.scss";

interface PlayerToggleProps {
  player: Player;
  active: boolean;
  onTogglePlayer(playerId: string): void;
}

function PlayerToggle({ player, active, onTogglePlayer }: PlayerToggleProps) {
  const onToggle = useCallback(() => {
    onTogglePlayer(player.id);
  }, [player.id, onTogglePlayer]);

  return (
    <span>
      <Toggle checked={active} id={player.id} onChange={onToggle} />
      <label htmlFor={player.id}>{player.name}</label>
    </span>
  );
}

function generateState(players: Array<Player>) {
  const newDictionary: {
    [key: string]: { player: Player; active: boolean };
  } = {};
  players.forEach(
    (player) => (newDictionary[player.id] = { player, active: true })
  );
  return newDictionary;
}

interface MatchesSetupProps {
  players: Array<Player>;
  onStartMatches(selectedPlayerrs: Array<Player>): void;
}

export default function ActivePlayers({
  players,
  onStartMatches,
}: MatchesSetupProps) {
  const [possiblePlayers, setPossiblePlayers] = useState<{
    [key: string]: { player: Player; active: boolean };
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
    const activePlayers: Array<Player> = [];
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
        Start matches
      </Button>
    </section>
  );
}

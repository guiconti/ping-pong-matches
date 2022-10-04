import { useMemo } from "react";
import Link from "next/link";
import type { Player as PlayerType } from "@/types";
import Player from "@/components/Player";
import styles from "./Players.module.scss";

export async function getServerSideProps() {
  const playersResult = await fetch(
    "http://127.0.0.1:8080/v1/players?expanded=true"
  );
  const playersData = await playersResult.json();
  const players = playersData.data;
  return {
    props: { players },
  };
}

interface PlayersProps {
  players: Array<PlayerType>;
}

export default function Players({ players }: PlayersProps) {
  const sortedPlayers = useMemo(() => {
    const newSortedPlayers = [...players];
    newSortedPlayers.sort((a, b) => {
      const aRatio = a.wins / (a.wins + a.losses);
      const bRatio = b.wins / (b.wins + b.losses);
      return aRatio < bRatio ? 1 : -1;
    });
    return newSortedPlayers;
  }, [players]);

  return (
    <section className={styles.wrapper}>
      {sortedPlayers.map((player) => (
        <Link key={player.id} href={`/players/${player.id}`}>
          <Player player={player} expanded />
        </Link>
      ))}
    </section>
  );
}

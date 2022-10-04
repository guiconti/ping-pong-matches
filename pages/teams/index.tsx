import { useMemo } from "react";
import Link from "next/link";
import Team from "@/components/Team";
import type { Team as TeamType } from "@/types";
import styles from "./Teams.module.scss";

export async function getServerSideProps() {
  const teamsResult = await fetch("http://127.0.0.1:8080/v1/teams");
  const teamsData = await teamsResult.json();
  const teams = teamsData.data;
  return {
    props: { teams },
  };
}

interface TeamsProps {
  teams: Array<TeamType>;
}

export default function Teams({ teams }: TeamsProps) {
  const sortedTeams = useMemo(() => {
    const newSortedTeams = [...teams];
    newSortedTeams.sort((a, b) => {
      const aRatio = a.wins / (a.wins + a.losses);
      const bRatio = b.wins / (b.wins + b.losses);
      return aRatio < bRatio ? 1 : -1;
    });
    return newSortedTeams;
  }, [teams]);

  return (
    <section className={styles.wrapper}>
      {sortedTeams.map((team) => (
        <Link key={team.id} href={`/teams/${team.id}`}>
          <Team team={team} />
        </Link>
      ))}
    </section>
  );
}

import { getLaunchAreasWithTiles } from "./actions/launch-areas";
import { DashboardClient } from "./dashboard-client";

export default async function HomePage() {
  const areas = await getLaunchAreasWithTiles();
  return <DashboardClient initialAreas={areas} />;
}

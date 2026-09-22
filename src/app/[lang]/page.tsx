import { MapView } from '@/features/map/components/map-view';
import { MapHeader } from '@/features/map/components/map-header';
import { MapDetailPanel } from '@/features/map/components/map-detail-panel';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Home page — renders the interactive map with overlays.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
      <MapHeader />
      <MapView />
      <MapDetailPanel />
    </main>
  );
}

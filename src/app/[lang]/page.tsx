import { MapView } from '@/features/map/components/map-view';
import { MapHeader } from '@/features/map/components/map-header';
import { MapDetailPanel } from '@/features/map/components/map-detail-panel';
import { en } from '@/lib/dictionaries/en';
import { id } from '@/lib/dictionaries/id';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Home page — renders the interactive map with overlays.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const dict = lang === 'en' ? en : id;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
      <MapHeader dict={dict} />
      <MapView />
      <MapDetailPanel dict={dict} />
    </main>
  );
}

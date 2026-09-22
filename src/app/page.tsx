import { redirect } from 'next/navigation';

/**
 * Root page — redirects to the default locale (Bahasa Indonesia).
 */
export default function RootPage() {
  redirect('/id');
}

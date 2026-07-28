import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ language: string }>;
}

export default async function Home({ params }: PageProps) {
  const { language } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (token) {
    redirect(`/${language}/profile`);
  } else {
    redirect(`/${language}/login`);
  }
}

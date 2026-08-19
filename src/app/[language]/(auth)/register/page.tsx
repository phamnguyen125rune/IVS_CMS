import { redirect } from 'next/navigation';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  redirect(`/${language}/login`);
}

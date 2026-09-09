import ClientNavbar from '@/components/layout/client/ClientNavbar';
import ClientFooter from '@/components/layout/client/ClientFooter';

interface ClientLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    language: string;
  }>;
}

export default async function ClientLayout({ children, params }: ClientLayoutProps) {
  const { language } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <ClientNavbar language={language} />

      <main className="flex-1">{children}</main>

      <ClientFooter language={language} />
    </div>
  );
}

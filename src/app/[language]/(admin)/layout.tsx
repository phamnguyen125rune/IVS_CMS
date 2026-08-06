import Sidebar from '@/components/sidebar/Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { language } = await params;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar language={language} />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

import SystemLogs from '@/components/mock-cms/admin/settings/SystemLogs';

export default function LogsPage() {
  return (
    <div
      className="relative min-h-full p-6"
      style={{
        background: 'var(--background)',
        color: 'var(--text)',
      }}
    >
      <SystemLogs />
    </div>
  );
}


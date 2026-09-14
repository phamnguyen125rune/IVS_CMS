export default function AdminFooter() {
  return (
    <footer
      className="shrink-0 border-t px-4 py-3 lg:px-8"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p
          className="text-xs"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          © 2026 CMS. Bảo lưu mọi quyền.
        </p>

        <p
          className="text-xs"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          CMS Administration
        </p>
      </div>
    </footer>
  );
}

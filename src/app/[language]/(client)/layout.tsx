// PLACEHOLDER — Public-facing client layout
//
// Intentionally separate from (admin)/ layout:
//   - Different header/footer (public navigation, no admin sidebar)
//   - No authentication required
//   - Server Component by default for SEO performance
//
// TODO: Add <ClientHeader /> and <ClientFooter /> once design is ready

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* TODO: <ClientHeader /> */}
      <main>{children}</main>
      {/* TODO: <ClientFooter /> */}
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/30 px-4 py-10">
      {/* Subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.05),transparent_40%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_40%)]"
      />

      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </main>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#08090E]">
      {/* Ambient gold glow */}
      <div className="ambient-gold pointer-events-none fixed inset-0" />

      <div className="relative z-10 flex flex-1 flex-col px-6 py-10">{children}</div>
    </div>
  );
}

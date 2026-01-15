import { AuthBanner } from "./_components/auth-banner";
import { AuthProvider } from "@/lib/providers/auth-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <AuthBanner />
        <div className="flex items-center justify-center p-8 bg-bg-main">
          <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-card shadow-lg border border-brand-secondary/20">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

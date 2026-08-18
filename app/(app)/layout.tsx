import { Nav } from "@/components/Nav/Nav";
import { ToastProvider } from "@/components/Toast/ToastProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Nav />
      <main>{children}</main>
    </ToastProvider>
  );
}

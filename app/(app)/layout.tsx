import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <main className="ml-[228px] flex min-h-screen flex-col">
        {children}
      </main>
    </>
  );
}

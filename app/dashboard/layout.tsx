import TaraChatbot from "../components/TaraChatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <TaraChatbot />
    </>
  );
}

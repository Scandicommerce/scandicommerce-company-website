export const metadata = {
  title: "ScandiCommerce CMS",
  description: "Content Management Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ margin: 0, minHeight: "100vh" }}>{children}</div>;
}

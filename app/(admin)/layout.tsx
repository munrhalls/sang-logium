export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      layout
      <div>{children}</div>
    </div>
  );
}

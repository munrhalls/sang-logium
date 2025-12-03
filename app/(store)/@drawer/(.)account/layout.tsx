import AccountShell from "./AccountShell";

export default function AccountLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  // TODO extract onto account shell component and import
  return <AccountShell>{children}</AccountShell>;
}

export default function AccountSlot({
  params,
}: {
  params: { slug: string[] };
}) {
  const path = params.slug.join("/");

  if (!path.includes("account")) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="p-6">I AM ACCOUNT DRAWER</div>
      </div>
    </div>
  );
}

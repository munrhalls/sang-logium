const Slide = async ({ prebuiltItem }: { prebuiltItem: JSX.Element }) => {
  return (
    <div
      className="/* slide */ z-20 relative h-full w-full"
      style={{
        flex: "0 0 100%",
      }}
    >
      {prebuiltItem}
    </div>
  );
};
export default Slide;

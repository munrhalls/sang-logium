const Slide = async ({
  prebuiltItem,
  multiplePerScreen = false,
}: {
  prebuiltItem: JSX.Element;
  multiplePerScreen?: boolean;
}) => {
  return (
    <div
      className={`z-20 relative h-full flex-[0_0_100%] ${multiplePerScreen ? "sm:flex-[0_0_50%] md:flex-[0_0_33.33333333334%] lg:flex-[0_0-25%] xl:flex-[0_0_20%]" : ""}`}
    >
      {prebuiltItem}
    </div>
  );
};
export default Slide;

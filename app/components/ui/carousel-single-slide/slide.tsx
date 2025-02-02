const Slide = async ({
  prebuiltItem,
}: {
  prebuiltItem: JSX.Element;
  multiplePerScreen?: boolean;
}) => {
  return <div className="h-full relative flex-[0_0_100%]">{prebuiltItem}</div>;
};
export default Slide;

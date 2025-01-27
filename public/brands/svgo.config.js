module.exports = {
  multipass: true,
  plugins: [
    "cleanupAttrs",
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeDesc",
    "removeUselessDefs",
    "removeEditorsNSData",
    "removeEmptyAttrs",
    "removeEmptyText",
    "removeEmptyContainers",
    "cleanupEnableBackground",
    {
      name: "convertPathData",
      params: {
        floatPrecision: 2,
      },
    },
  ],
};

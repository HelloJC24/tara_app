const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = (() => {
  // Get the default Expo Metro configuration
  const config = getDefaultConfig(__dirname);

  // Configure SVG handling
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    minifierConfig: {
      keep_classnames: true, // Ensure classnames are kept (can help with eval warnings)
      keep_fnames: true, // Ensure function names are kept
    },
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"), // Exclude SVG from asset extensions
    sourceExts: [...resolver.sourceExts, "svg"], // Treat SVG as a source file
  };

  // Apply NativeWind configuration
  return withNativeWind(config, { input: "./global.css" });
})();

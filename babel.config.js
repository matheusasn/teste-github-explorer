module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@domain': './src/domain',
            '@application': './src/application',
            '@infrastructure': './src/infrastructure',
            '@presentation': './src/presentation',
            '@test-utils': './src/test-utils',
          },
        },
      ],
      // Reanimated 4 usa o plugin do worklets — DEVE ser o último plugin da lista.
      'react-native-worklets/plugin',
    ],
  };
};

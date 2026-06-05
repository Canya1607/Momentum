module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', { root: ['.'], alias: { '@': './src', 'momentum-haptics': './modules/momentum-haptics/src/index' } }],
    ],
  };
};

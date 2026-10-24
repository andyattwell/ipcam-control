const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background.js',
      rendererProcessFile: 'src/main.js',
      preload: 'src/preload.js',
      // externals: ['sqlite3'],
      // buildDependenciesFromSource: true,
      // downloadAlternateFFmpeg: true,
      // asar: false
    },
  },
})

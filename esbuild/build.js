const esbuild = require('esbuild')
const Helper = require('./class/Helper.js')

const helper = new Helper()

const title = 'Parrot'
const description = 'Viewer for tweet archives created with the Twitter Media Downloader'
const version = process.env.PARROT_VERSION || 'dev'
const gitCommit = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()

async function setup () {
  // Remove and recreate dist folder
  await helper.removeFolder('./dist')
  await helper.createFolder('./dist')

  console.log('Copying files...')
  helper.copy('./src/images/favicon.ico', './dist/favicon.ico')
  await helper.copy('./src/index.html', './dist/index.html')

  await helper.replaceTagInFile('./dist/index.html', 'title', title)
  await helper.replaceTagInFile('./dist/index.html', 'description', description)
  await helper.replaceTagInFile('./dist/index.html', 'version', version)
  await helper.replaceTagInFile('./dist/index.html', 'gitCommit', gitCommit)
}

setup().then(() => {
  console.log('Running esbuild...')

  esbuild.build({
    entryPoints: ['./src/js/app.js'],
    bundle: true,
    minify: true,
    outdir: 'dist/'
  })

  esbuild.build({
    entryPoints: ['./src/css/app.css'],
    bundle: true,
    minify: true,
    outdir: 'dist/'
  })
})

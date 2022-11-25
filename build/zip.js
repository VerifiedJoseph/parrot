//
// Create zip file of dist folder
//
const JSZip = require('JSZip')
const fs = require('fs').promises

const folder = './dist/'
const zipFilename = 'parrot.zip'

const zip = new JSZip()

/**
 * Get files in a folder
 * @param {string} dir Folder path
 * @returns Array of filepaths
 */
async function getFiles (dir) {
  const items = await fs.readdir(dir, { withFileTypes: true })

  let paths = []
  for (const item of items) {
    if (item.name === zipFilename) {
      continue
    }

    if (item.isDirectory() === true) {
      let subDirPaths = await getFiles(dir + item.name)
      subDirPaths = subDirPaths.map(function (path) {
        return item.name + '/' + path
      })

      paths = paths.concat(subDirPaths)
    } else {
      paths.push(item.name)
    }
  }

  return paths
}

getFiles(folder).then(paths => {
  console.log('Creating zip file')

  paths.forEach(filepath => {
    console.log(`adding: ${filepath}`)

    const data = fs.readFile(folder + filepath)
    zip.file(filepath, data)
  })

  zip.generateAsync({ type: 'nodebuffer', streamFiles: true })
    .then(function (content) {
      const path = folder + zipFilename

      fs.writeFile(path, content)

      console.log(`Created: ${path}`)
    })
}).catch(function (err) {
  console.error(err)
  process.exit(1)
})

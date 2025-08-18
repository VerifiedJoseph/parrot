import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import replace from 'replace-in-file';

/**
 * Replace tag in file
 * @param {string} filepath Filepath
 * @param {string} tag Tag name
 * @param {string} replacement Replacement string
  */
export async function replaceTagInFile (filepath, tag, replacement) {
  try {
    await replace({
      files: filepath,
      from: new RegExp('<%= ' + tag + ' %>', 'g'),
      to: replacement
    })
  } catch (error) {
    throw new Error('Error occurred:', error)
  }
}

/**
 * Copy file or folder
 * @param {string} source Source
 * @param {string} destination Destination
 */
export async function copyFile (source, destination) {
  try {
    source = path.resolve(source)
    destination = path.resolve(destination)

    console.log(`Copying ${source} to ${destination}`)

    await fsp.copyFile(source, destination);
  } catch {
    throw new Error(`Failed to copy file`);
  }
}

/**
 * Create folder
  */
export async function createFolder (folder) {
  folder = path.resolve(folder)

  if (fs.existsSync(folder) === false) {
    await fsp.mkdir(folder, { recursive: true })
  }
}

  /**
   * Remove folder
   */
export async function removeFolder (folder) {
  folder = path.resolve(folder)

  try {
    if (fs.existsSync(folder) === true) {
      await fsp.rm(folder, { recursive: true, force: true })
    }
  } catch (err) {
    throw new Error('Folder remove failed', { cause: err })
  }
}

  /**
   * Remove file
   */
export async function removeFile (file) {
  file = path.resolve(file)

  try {
    if (fs.existsSync(file) === true) {
      await fsp.rm(file)
    }
  } catch (err) {
    throw new Error('File remove failed', { cause: err })
  }
}

  /**
   * Create symlink
   */
export function createSymlink (source, destination, type = 'file') {
  source = path.resolve(source)
  destination = path.resolve(destination)

  if (fs.existsSync(destination) === false) {
    fs.symlink(
      source,
      destination,
      type, (err) => err && console.log(err)
    )
  }
}

  /**
   * Remove symlink
   */
export async function removeSymlink (symlink) {
  symlink = path.resolve(symlink)

  fs.readlink(symlink, (err, target) => {
    if (target !== undefined) {
      fs.unlink(symlink, err => {
        if (err) {
          throw new Error('Symlink remove failed', { cause: err })
        }
      })
    } else if (err) {
      throw new Error('readlink failed', { cause: err })
    }
  })
}

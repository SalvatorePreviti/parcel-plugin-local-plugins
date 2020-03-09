'use strict'

const path = require('path')
const fs = require('fs')

module.exports = function(bundler) {
  const packageJsonPath = findPackageJsonPath()
  if (!packageJsonPath) {
    return
  }

  const packageJson = loadPackageJson(packageJsonPath)
  let customPlugins = packageJson && packageJson['parcel-plugin-local-plugins']
  if (!customPlugins) {
    return
  }

  const rootDir = path.dirname(packageJsonPath)

  if (typeof customPlugins === 'string') {
    customPlugins = customPlugins.split(' ')
  }

  if (!Array.isArray(customPlugins)) {
    throw new TypeError('parcel-plugin-local-plugins in package.json must be an array')
  }

  for (let pluginId of customPlugins) {
    if (typeof pluginId !== 'string') {
      throw new TypeError('parcel-plugin-local-plugins in package.json must be an array that contains strings')
    }
    pluginId = pluginId.trim()
    if (!pluginId) {
      continue
    }
    if (typeof pluginId === 'string') {
      if (pluginId.startsWith('.') || pluginId.startsWith('/') || pluginId.startsWith('\\')) {
        pluginId = path.resolve(rootDir, pluginId)
      }
    }
    let plugin = require(pluginId)
    if (typeof plugin === 'object' && plugin !== null) {
      plugin = plugin.parcelPlugin || plugin.main
    }
    if (typeof plugin === 'function') {
      plugin(bundler)
    }
  }
}

function findPackageJsonPath() {
  return findPackageJsonUp('.') || findPackageJsonUp(path.dirname(__dirname))
}

function loadPackageJson(packageJsonPath) {
  try {
    return require(packageJsonPath) || null
  } catch (_error) {
    return null
  }
}

function findPackageJsonUp(directory) {
  directory = path.resolve(directory)
  for (;;) {
    const packageJson = path.join(directory, 'package.json')
    if (fs.existsSync(packageJson)) {
      return packageJson
    }
    const parent = path.dirname(directory)
    if (parent.length >= directory.length) {
      break
    }
    directory = parent
  }
  return null
}

# parcel-plugin-local-plugins

Loads custom parcel plugins by configuration in package.json.

Useful both for local development of new plugins or for writing simple one off plugins inside your project, like custom transformations.

## Usage

Install this package

```sh
npm install parcel-plugin-local-plugins --save-dev
```

Add a plugin "my-parcel-plugin.js" to be loaded in a local folder.

```js
module.exports = bundler => {
  console.log('MY PLUGIN LOADED!', !!bundler)
}
```

Add a "parcel-plugin-local-plugins" section in your package.json file with your files to load

```json
{
  "name": "my-package",
  ...
  "parcel-plugin-local-plugins": ["./my-parcel-plugin"]

}
```

Run parcel, for example like this

```sh
parcel serve src/index.html
```

Your custom plugin "my-parcel-plugin.js" will be loaded by parcel.

## License

MIT

Use at your own risks.

## Author

Salvatore Previti

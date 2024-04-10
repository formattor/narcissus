webpack5 : Module Federation

remote
``` js
const ModuleFederatedPlugin = require('webpack/lib/container/ModuleFederationPlugin')
// webpack.config.js
new ModuleFederatedPlugin({
    name: 'remote',
    filename: 'remoteEntry.js',
    exposes: {
        './addList': './list.js'
    }
})
```
host
``` js
const ModuleFederatedPlugin = require('webpack/lib/container/ModuleFederationPlugin')
// webpack.config.js
new ModuleFederatedPlugin({
    name: 'host',
    remotes: {
        remote: 'remote@http://localhost:9001/remoteEntry.js'
    }
})
```
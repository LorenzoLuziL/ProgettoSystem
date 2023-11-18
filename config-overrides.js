module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        "fs": false,
        "tls": false,
        "net": false,
        //"http": require.resolve("stream-http"),
        "http": false,
        "https": false,
       }
    
    return config
}
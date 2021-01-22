// require dependencies
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const {
    webpack
} = require("webpack");

// configure webpack
const config = {
    entry: "./public/assets/js/index.js",
    output: {
        path: __dirname + "/public/dist",
        filename: "bundle.js"
    },
    mode: "development",
    plugins: [new WebpackPwaManifest({
        name: "Budget Tracker App",
        short_name: "Budget App",
        description: "PWA Budget Tracker",
        background_color: "white",
        theme_color: "blue",
        start_url: "/",
        display: "standalone",
        inject: true,
        fingerprints: false,
        icons: [{
            src: path.resolve("public/assets/images/icons/icon-192x192.png"),
            sizes: [192, 512],
            destination: path.join("assets", "icons")
        }]
    })]
};
// export config
module.exports = config;
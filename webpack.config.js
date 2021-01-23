const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: "./public/assets/js/index.js",
    output: {
        path: __dirname + "/public/dist",
        publicPath: "",
        filename: "bundle.js"
    },
    mode: "development",
    plugins: [new WebpackPwaManifest({
        name: "Budget Tracker App",
        short_name: "Budget App",
        description: "PWA Budget Tracker App",
        background_color: "white",
        theme_color: "#317EFB",
        start_url: "/",
        display: "standalone",
        inject: true,
        fingerprints: false,
        icons: [{
            src: path.resolve("public/assets/images/icons/icon-512x512.png"),
            sizes: [192, 512],
            destination: path.join("assets", "icons")
        }]
    })]
};
module.exports = config;
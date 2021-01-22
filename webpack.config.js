// configure webpack
const config = {
    entry: "./public/assets/js/index.js",
    output: {
        path: __dirname + "/public/dist",
        filename: "bundle.js"
    },
    mode: "development"
};

module.exports = config;
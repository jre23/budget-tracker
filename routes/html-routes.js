// require dependencies
const router = require("express").Router();
const path = require("path");
// root route
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
// catch all route. directs anything after / in the url to index.html
router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
// export router
module.exports = router;
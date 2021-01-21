// require dependencies
const router = require("express").Router();
const Transaction = require("../models/transaction.js");
// route to post a new transaction to mongodb. this route is called by index.js sendTransaction()
router.post("/api/transaction", ({
  body
}, res) => {
  Transaction.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});
// route to post new transactions in bulk (one or more items in the pending indexedDB) to mongodb. this route is called by db.js checkDataBase()
router.post("/api/transaction/bulk", ({
  body
}, res) => {
  Transaction.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});
// route to get all of the transactions from mongodb. this route is called by index.js as soon as the webpage loads
router.get("/api/transaction", (req, res) => {
  Transaction.find({}).sort({
      date: -1
    })
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});
// router
module.exports = router;
// require dependencies
const mongoose = require("mongoose");
// define mongoose Schema constructor
const Schema = mongoose.Schema;
// define transaction schema
const transactionSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Enter a name for transaction"
  },
  value: {
    type: Number,
    required: "Enter an amount"
  },
  date: {
    type: Date,
    default: Date.now
  }
});
// define Transaction mongoose model
const Transaction = mongoose.model("Transaction", transactionSchema);
// export Transaction model
module.exports = Transaction;
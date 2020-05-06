const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.set("useFindAndModify", false);
const itemSchema = new Schema({
  email: String,
  name: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});
const itemModel = mongoose.model("collection_for_hws", itemSchema);
module.exports = itemModel;

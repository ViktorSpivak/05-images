const itemModel = require("../models/model");

class Controller {
  findEmail = (value) => itemModel.findOne({ email: value });
  createUser = (passwordHash, email, name, subscription) =>
    itemModel.create({
      name,
      email,
      password: passwordHash,
      subscription,
    });
  findAll = () => itemModel.find();
  findAndUpdate = (id, newProperties) =>
    itemModel.findByIdAndUpdate(id, { $set: newProperties }, { new: true });
  findAndDelete = (id) => itemModel.findOneAndDelete(id);
  // findByIdAndUpdate = (id, elem) =>
  //   itemModel.findByIdAndUpdate(id, elem, { new: true });
  findById = (id) => itemModel.findById(id);
}
module.exports = new Controller();

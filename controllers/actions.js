const itemModel = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const COUNT_FACTOR = 7;

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET);

exports.createUser = async (req, res, next) => {
  try {
    const { password, email, name, subscription } = req.body;
    const isEmail = await itemModel.findOne({ email });

    if (!isEmail) {
      const passwordHash = await bcrypt.hash(password, COUNT_FACTOR);

      const user = await itemModel.create({
        name,
        email,
        password: passwordHash,
        subscription,
      });

      const token = createToken(user._id);
      await itemModel.findByIdAndUpdate(user._id, { token });
      return res.status(201).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } else
      res.status(400).json({
        message: "Email in use",
      });
  } catch (error) {
    next(error);
  }
};
exports.loginUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await itemModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = createToken(user._id);
    await itemModel.findByIdAndUpdate(user._id, { token });
    res.status(200).send(token);
  } catch (error) {
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const user = await itemModel.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await itemModel.findByIdAndUpdate(req.user._id, { token: null });
    return res.status(200).json({
      message: "Logout success",
    });
  } catch (error) {
    next(error);
  }
};
exports.verifyToken = async (req, res, next) => {
  try {
    const requestToken = req.get("authorization").replace("Bearer ", "");
    let userId;
    try {
      userId = jwt.verify(requestToken, process.env.JWT_SECRET).id;

      const user = await itemModel.findById(userId);
      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.user = user;
      req.token = requestToken;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    next(error);
  }
};
exports.currentUser = async (req, res, next) => {
  try {
    const user = await itemModel.findById(req.body.id);
    const { email, subscription } = user;
    return res.status(200).json({
      email: email,
      subscription: subscription,
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
exports.listContacts = async (req, res) => {
  try {
    const item = await itemModel.find();
    return res.status(200).json(item);
  } catch (error) {
    res.send(error);
  }
};
exports.getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const item = await itemModel.findOne({ id: contactId });
    if (item) {
      return res.status(200).json(item);
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
exports.removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const item = await itemModel.findOneAndDelete({ id: contactId });
    if (item) {
      res.status(200).send({ message: "contact deleted" });
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
// exports.addContact = async (req, res, next) => {
//   try {
//     const item = await itemModel.create(req.body);
//     return res.status(200).json(item);
//   } catch (error) {
//     next(error);
//   }
// };
exports.updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const newProperties = req.body;

    const item = await itemModel.findOneAndUpdate(
      { id: contactId },
      { $set: newProperties },
      { new: true }
    );
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

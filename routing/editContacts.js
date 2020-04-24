const express = require("express");
const Joi = require("@hapi/joi");
const router = express.Router();
const contactsActions = require("../contacts");

router.post("/", (req, res, next) => {
  const rules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const validationResult = rules.validate(req.body);
  if (validationResult.error) {
    res.status(400).header({ message: "missing required name field" });
    return res.send(validationResult);
  }
  next();
});
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await contactsActions.addContact(name, email, phone);
  res.status(201).send(newContact);
});

router.delete("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const isIdIn = await contactsActions.removeContact(contactId);
  console.log(contactId);

  if (isIdIn) {
    res.status(200).send({ message: "contact deleted" });
  } else {
    res.status(404).send({ message: "Not found" });
  }
});

router.patch("/:contactId", (req, res, next) => {
  const isProperty = (prop) => req.body.hasOwnProperty(prop);
  const hasProperty =
    isProperty("name") || isProperty("email") || isProperty("phone");

  if (!hasProperty) {
    res.status(400).send({ message: "missing fields" });
    return;
  }
  const rules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  }).keys();

  const validationResult = rules.validate(req.body);
  if (validationResult.error) {
    res
      .status(400)
      .header({ message: "missing required name field" })
      .send(validationResult);
    return;
  }
  next();
});

router.patch("/:contactId", async (req, res) => {
  const propertiesForUpdate = Object.entries(req.body);
  const { contactId } = req.params;
  const newContact = await contactsActions.updateContact(
    contactId,
    propertiesForUpdate
  );
  if (newContact) {
    res.status(200).send(newContact);
  } else res.header({ message: "Not found" }).status(404).send();
});

module.exports = router;

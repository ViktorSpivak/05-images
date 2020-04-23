const express = require("express");
const cors = require("cors");
const Joi = require("@hapi/joi");

const argv = require("yargs").argv;
const contactsActions = require("./contacts");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// const isValid = (req, res, next) => {
//   console.log(req);

// const rules = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().required(),
//   phone: Joi.number().required(),
// });
// const validationResult = Joi.validate(req.query, rules);
// if (validationResult.error) {
//   res.status(400).header({ message: "missing required name field" });
//   return res.send(validationResult);
// }
//   next();
// };
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/contacts", async (req, res) => {
  const allContacts = await contactsActions.listContacts();
  res.send(allContacts);
});
app.get("/contacts/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const contactById = await contactsActions.getContactById(contactId);
  if (contactById) {
    res.send(contactById);
  } else {
    res.status(404);
    res.header({ message: "Not found" });
    res.send();
  }
});

app.post("/contacts", (req, res, next) => {
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
app.post("/contacts", async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await contactsActions.addContact(name, email, phone);
  res.status(201).send(newContact);
});

app.delete("/contacts/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const isIdIn = await contactsActions.removeContact(contactId);
  if (isIdIn) {
    res.status(200).send({ message: "contact deleted" });
  } else {
    res.status(404);
    res.header({ message: "Not found" });
    res.send();
  }
});

app.patch("/contacts/:contactId", (req, res, next) => {
  const hasProperty =
    req.body.hasOwnProperty("name") ||
    req.body.hasOwnProperty("email") ||
    req.body.hasOwnProperty("phone");

  if (!hasProperty) {
    res.status(400).header({ message: "missing fields" }).send();
    return;
  }
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

app.patch("/contacts/:contactId", async (req, res) => {
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

app.listen(3001, () => {
  console.log("Example app listening on port 3001!");
});
// const invokeAction = ({ action, id, name, email, phone }) => {
//   switch (action) {
//     case "list":
//       contactsActions.listContacts();
//       break;

//     case "get":
//       contactsActions.getContactById(id);
//       break;

//     case "add":
//       contactsActions.addContact(name, email, phone);
//       break;

//     case "remove":
//       contactsActions.removeContact(id);
//       break;

//     default:
//       console.warn("\x1B[31m Unknown action type!");
//   }
// };

// invokeAction(argv);

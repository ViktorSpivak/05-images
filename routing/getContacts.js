const express = require("express");
const router = express.Router();
const contactsActions = require("../controllers/actions");
const validations = require("../controllers/validation");

router.get("/", contactsActions.listContacts);
router.get(
  "/current",
  contactsActions.verifyToken,
  contactsActions.currentUser
);
router.get("/:contactId", contactsActions.getContactById);
module.exports = router;

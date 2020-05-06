const express = require("express");
const router = express.Router();
const contactsActions = require("../controllers/user.controller");

router.get("/", contactsActions.verifyToken, contactsActions.listContacts);
router.get(
  "/current",
  contactsActions.verifyToken,
  contactsActions.currentUser
);
router.get(
  "/:contactId",
  contactsActions.verifyToken,
  contactsActions.getContactById
);

module.exports = router;

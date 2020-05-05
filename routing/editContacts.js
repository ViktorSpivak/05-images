const express = require("express");
const router = express.Router();
const contactsActions = require("../controllers/actions");
const validations = require("../controllers/validation");

router.post(
  "/register",
  validations.validateRequest,
  contactsActions.createUser
);

router.post("/login", validations.validateSignIn, contactsActions.loginUser);

router.post(
  "/logout",
  validations.validateSignIn,
  contactsActions.verifyToken,
  contactsActions.logout
);

router.delete("/:contactId", contactsActions.removeContact);

router.patch(
  "/:contactId",
  validations.validateRequest,
  contactsActions.updateContact
);

module.exports = router;

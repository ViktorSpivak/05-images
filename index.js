const contactsActions = require("./contacts");
const argv = require("yargs").argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      contactsActions.listContacts();
      break;

    case "get":
      contactsActions.getContactById(id);
      break;

    case "add":
      contactsActions.addContact(name, email, phone);
      break;

    case "remove":
      contactsActions.removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);

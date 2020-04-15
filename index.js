const contactsActions = require("./contacts");

// contactsActions.getContactById(9);
const argv = require("yargs").argv;
// console.log(argv);

function invokeAction({ action, id, name, email, phone }) {
  // console.log(action, id, name, email, phone);

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

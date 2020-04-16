const path = require("path");
const fs = require("fs");
const shortid = require("shortid");
const contactsPath = path.join(__dirname, "./db/contacts.json");

exports.listContacts = () =>
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    console.table(JSON.parse(data));
  });
exports.getContactById = (contactId) => {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    const ContactById = JSON.parse(data).find((el) => el.id === contactId);
    console.table(ContactById);
  });
};

exports.removeContact = (contactId) => {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    const listWithRemovedContact = JSON.stringify(
      JSON.parse(data).filter((el) => el.id !== contactId)
    );

    fs.writeFile(contactsPath, listWithRemovedContact, (err) => {
      if (err) throw err;
    });
  });
};

exports.addContact = (name, email, phone) => {
  const id = shortid.generate();
  const newContact = { id, name, email, phone };
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;

    const listWithAddedContact = JSON.stringify(
      data ? [...JSON.parse(data), newContact] : [newContact]
    );
    fs.writeFile(contactsPath, listWithAddedContact, (err) => {
      if (err) throw err;
    });
  });
};

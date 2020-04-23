const path = require("path");
const fs = require("fs");
const { promises: fsPromises } = fs;
const shortid = require("shortid");
const contactsPath = path.join(__dirname, "./db/contacts.json");

exports.listContacts = async () =>
  await fsPromises.readFile(contactsPath, "utf8");

exports.getContactById = async (contactId) => {
  const contacts = await fsPromises.readFile(contactsPath, "utf8");
  const ContactById = JSON.parse(contacts).find(
    (el) => el.id === Number(contactId)
  );
  return ContactById;
};

exports.removeContact = async (contactId) => {
  const contacts = await fsPromises.readFile(contactsPath, "utf8");

  const isIdIn = JSON.parse(contacts).some(
    (el) => el.id.toString() === contactId
  );

  if (isIdIn) {
    const listWithRemovedContact = JSON.stringify(
      JSON.parse(contacts).filter((el) => el.id.toString() !== contactId)
    );
    fs.writeFile(contactsPath, listWithRemovedContact, (err) => {
      if (err) throw err;
    });
  }
  return isIdIn;
};

exports.addContact = async (name, email, phone) => {
  const id = shortid.generate();
  const newContact = { id, name, email, phone };
  const contacts = await fsPromises.readFile(contactsPath, "utf8");
  const listWithAddedContact = JSON.stringify(
    contacts ? [...JSON.parse(contacts), newContact] : [newContact]
  );
  fs.writeFile(contactsPath, listWithAddedContact, (err) => {
    if (err) throw err;
  });
  return newContact;
};
exports.updateContact = async (id, newProperties) => {
  const contacts = JSON.parse(await fsPromises.readFile(contactsPath, "utf8"));
  const updatedContact = contacts.find((el) => el.id.toString() === id);

  if (updatedContact) {
    newProperties.forEach((el) => (updatedContact[el[0]] = el[1]));
    const newContacts = JSON.stringify(
      contacts.map((el) => (el.id.toString() === id ? updatedContact : el))
    );

    fs.writeFile(contactsPath, newContacts, (err) => {
      if (err) throw err;
    });
  }

  return updatedContact;
};

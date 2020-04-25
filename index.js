const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const getContacts = require("./routing/getContacts");
const editContacts = require("./routing/editContacts");

// const argv = require("yargs").argv;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));
app.use("/contacts", getContacts);
app.use("/contacts", editContacts);

app.listen(3001, () => {
  console.log("App listening on port 3001!");
});

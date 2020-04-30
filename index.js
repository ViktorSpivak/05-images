const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const getContacts = require("./routing/getContacts");
const editContacts = require("./routing/editContacts");
require("dotenv").config();

const URLdb = process.env.URLdb;
const PORT = process.env.PORT;

module.exports = class myMongoDBServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDataBase();
    this.startListening();
  }
  initServer = () => {
    this.server = express();
  };
  initMiddlewares = () => {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(cors());
    this.server.use(morgan("combined"));
  };
  initRoutes = () => {
    this.server.use("/contacts", getContacts);
    this.server.use("/contacts", editContacts);
  };
  initDataBase = async () => {
    try {
      await mongoose.connect(URLdb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connection successful");
    } catch (error) {
      console.log("Connecting error:", error.message);
      process.exit(1);
    }

    // const db = mongoose.connection;
    // db.on("error", console.log(ERRoR));
  };
  startListening = () => {
    this.server.listen(3001, () => {
      console.log("myMongoDBServer listening on port:", PORT);
    });
  };
};

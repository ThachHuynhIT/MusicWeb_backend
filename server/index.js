const path = require("path");
const express = require("express");
const cors = require("cors");
const methodOverride = require("method-override");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
require("dotenv").config();

const route = require("./routes");
const db = require("./config/db");

db.connect();

// const { engine } = require ('express-handlebars');
const app = express();
app.use(cors());
app.use(cookieParser());
const port = process.env.SERVER_PORT || 3000;

app.use(express.static(path.join(__dirname, "../test/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// HTML logger
app.use(morgan("combined"));

//template engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
    },
  })
);

// app.engine('handlebars', engine());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../test/resource/views"));

//route khoi tao
route(app);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});

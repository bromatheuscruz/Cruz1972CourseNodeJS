const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config");

const app = express();

app.use(
  bodyParser.json({
    limit: "10mb"
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

//Liberando CORS para teste
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

//Conecta ao banco
mongoose.connect(config.connectionStrings);

//Carrega os Models
const Product = require("./models/product");
const Customer = require("./models/customer");
const Order = require("./models/order");

//Carrega as rotas
const indexRouter = require("./routes/index-route");
const productRouter = require("./routes/product-route");
const customerRouter = require("./routes/customer-route");
const orderRouter = require("./routes/order-route");

app.use("/", indexRouter);
app.use("/products", productRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);

module.exports = app;

const moongose = require("mongoose");
const Order = moongose.model("Order");

exports.create = async data => {
  var order = new Order(data);
  await order.save();
};

exports.get = async data => {
  var res = await Order.find({});
  return res;
};

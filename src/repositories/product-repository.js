const mongoose = require("mongoose");
const Product = mongoose.model("Product");

exports.getAll = async () => {
  const res = await Product.find({});
  return res;
};

exports.get = async () => {
  const res = await Product.findOne(
    { slug: req.params.slug, active: true },
    "title price slug tags"
  );
  return res;
};

exports.getBySlug = async slug => {
  const res = await Product.findOne(
    { active: true, slug: slug },
    "title price slug"
  );
  return res;
};

exports.getById = async id => {
  const res = await Product.findById(id);
  return res;
};

exports.getByTag = async tag => {
  const res = await Product.find(
    {
      tags: tag,
      active: true
    },
    "title description price slugs tags"
  );
  return res;
};

exports.create = async data => {
  var product = new Product(data);
  await product.save();
};

exports.update = async (id, data) => {
  await Product.findByIdAndUpdate(id, {
    $set: {
      title: data.title,
      description: data.description,
      price: data.price,
      slug: data.slug
    }
  });
};

exports.delete = async id => {
  const res = await Product.findOneAndRemove(id);
  return res;
};

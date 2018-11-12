const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  // _id Cria por padrão um GUID

  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    // Cadeira gamer = cadeira-gamer
    type: String,
    required: [true, 'O slug é obrigatório'],
    trim: true,
    index: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },

  active: {
    type: Boolean,
    required: true,
    default: true
  },
  tags: [
    {
      type: String,
      required: true
    }
  ]
});

module.exports = mongoose.model("Product", schema);

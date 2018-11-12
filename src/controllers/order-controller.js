const repository = require("../repositories/order-repository");
const guid = require("guid");

exports.post = async (req, res, next) => {
  try {
    // Recupera o token
    const token =
      req.body.token || req.headers["x-access-token"] || req.quuery.token;

    //Decodifica token
    const data = await authService.decodeToken(token);

    await repository.create({
      customer: data.id,
      number: guid.raw(),
      items: req.body.items
    });
    res.status(201).send("Pedido realizado com sucesso");
  } catch (e) {
    res.status(500).send("Falha ao realizar o pedido");
  }
};

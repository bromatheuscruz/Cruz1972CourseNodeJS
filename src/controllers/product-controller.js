const ValidationContract = require("../validators/validator");
const repository = require("../repositories/product-repository");
const azure = require("azure-storage");
const config = require("../config");
const guid = require("guid");

exports.getByTag = async (req, res, next) => {
  try {
    const data = await repository.getByTag(req.params.tag);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao processar sua requisição"
    });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    var data = await repository.getAll();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao processar sua requisição"
    });
  }
};

exports.get = async (req, res, next) => {
  try {
    var data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao processar sua requisição"
    });
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    var data = await repository.getBySlug(req.params.slug);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao precessar sua requisição"
    });
  }
};

exports.getById = async (req, res, next) => {
  try {
    var data = await repository.getById(req.params.id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.post = async (req, res, next) => {
  let contract = new ValidationContract();

  contract.hasMinLen(
    req.body.title,
    3,
    "O título deve conter pelo menos 3 caracteres"
  );

  contract.hasMinLen(
    req.body.slug,
    3,
    "O slug deve conter pelo menos 3 caracteres"
  );

  contract.hasMinLen(
    req.body.description,
    3,
    "A descrição deve conter pelo menos 3 caracteres"
  );

  if (!contract.isValid()) {
    res
      .status(400)
      .send(contract.errors())
      .end();
    return;
  }

  try {
    const blobSvc = azure.createBlobService(config.containerConnectionString);

    let filename = guid.raw().toString() + ".jpg";
    let rawdata = req.body.image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], "base64");

    await blobSvc.createBlockBlobFromText(
      "product-images",
      filename,
      buffer,
      {
        contentType: type
      },
      (error, result, response) => {
        if (error) {
          filename = "default-product.jpg";
        }
      }
    );

    await repository.create({
      title: req.body.title,
      slug: req.boy.slug,
      description: req.body.description,
      price: req.body.price,
      active: req.body.active,
      tags: req.body.tags,
      image: "suaurldeimagem" + filename
    });
    res.status(201).send({ message: "Produto cadastrado com sucesso" });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Não foi possível cadastrar o produto"
    });
  }
};

exports.put = async (req, res, next) => {
  try {
    await repository.update(req.params.id, req.body);
    res.status(201).send({
      message: "Produto atualizado com sucesso"
    });
  } catch (e) {
    res.status(400).send({
      message: "Falha ao atualizar produto",
      data: e
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await repository.delete(req.params.id);
    res.status(200).send({
      message: "Produto removido com sucesso"
    });
  } catch (e) {
    res.status(400).send({
      message: "Falha ao deletar o produto",
      data: e
    });
  }
};

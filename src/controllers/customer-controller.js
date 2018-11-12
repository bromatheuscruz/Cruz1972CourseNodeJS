const ValidatorContract = require("../validators/validator");
const repository = require("../repositories/customer-repository");
const emailService = require("../services/email-service");
SENGRID;
const authService = require("../services/auth.service");
const md5 = require("md5");

exports.refreshToken = async (req, res, next) => {
  const token =
    req.body.token || req.headers["x-access-token"] || req.quuery.token;
  const data = await authService.decodeToken(token);

  const customer = await repository.getById(data.id);

  if (!customer) {
    res.status(404).send({
      message: "Cliente não encontrado"
    });
    return;
  }

  const tokenData = await authService.generateToken({
    id: customer._id,
    email: customer.email,
    nome: customer.nome,
    roles: customer.roles
  });

  res.status(201).send({
    token: tokenData,
    data: {
      email: customer.email,
      name: customer.name
    }
  });
};

exports.authenticate = async (req, res, next) => {
  try {
    const customer = await repository.authenticate({
      email: req.body.email,
      password: md5(req.body.password + global.SALT_KEY)
    });

    if (!customer) {
      res.status(404).send({
        message: "Uusário ou senha inválidos"
      });
      return;
    }

    const token = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles
    });

    res.status(201).send({
      token: token,
      data: {
        email: customer.email,
        name: customer.name
      }
    });
  } catch (e) {}
};

exports.post = async (req, res, next) => {
  const contract = new ValidatorContract();

  contract.isRequired(req.body.name, "O nome deve ser preenchido");
  contract.hasMinLen(
    req.body.password,
    6,
    "A senha deve conter no mínimo 6 caracteres"
  );
  contract.isEmail(req.body.email, "E-mail inválido");

  if (!contract.isValid()) {
    res
      .status(400)
      .send(contract.errors())
      .end();
    return;
  }

  try {
    await repository.create({
      name: req.body.name,
      email: req.body.email,
      password: md5(req.body.password + global.SALT_KEY),
      roles: ["user"]
    });

    emailService.send(
      req.body.email,
      "Bem vindo ao Node Store",
      global.EMAIL_TMPL.replace("{0}", req.body.name)
    );

    res.status(200).send({ message: "Cliente cadastrado com sucesso" });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao criar o cliente",
      data: e
    });
  }
};

# node-str
09/11 ~ 11/11 com NodeJs e Angular

Utilizei nesse projeto de aprendizado:

Para serviço de banco de dados
https://mlab.com

Para serviço de e-mail
https://app.sendgrid.com/

Para serviço storage das imagens do produto
https://azure.microsoft.com/en-us/

global.SALT_KEY = "sua-key-que-sera-usada-no-token";
global.EMAIL_TMPL = "Olá, <strong>{0}</strong>, seja bem vindo ao Node Store";

module.exports = {
  connectionStrings: "seu CONNECTIONSTRING do mlab",
  sendgridKey: "sua SENDGRIDKEY",
  containerConnectionString: "seu CONTAINERCONNECTIONSTRING do Azure Storage"
};




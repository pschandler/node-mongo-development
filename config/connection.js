require("dotenv").config();
const mongoose = require("mongoose");
const { getSecret } = require("./keyvault");

async function putKeyVaultSecretInEnvVar() {
  const secretName = process.env.KEY_VAULT_SECRET_NAME_DATABASE_URL;
  const keyVaultName = process.env.KEY_VAULT_NAME;

  console.log("putKeyVaultSecretInEnvVar:09 ", secretName);
  console.log("putKeyVaultSecretInEnvVar:10 ", keyVaultName);

  if (!secretName || !keyVaultName)
    throw Error("getSecret: Required params missing");

  connectionString = await getSecret(secretName, keyVaultName);
  process.env.DATABASE_URL = connectionString;
}

async function getConnectionInfo() {
  if (!process.env.DATABASE_URL) {
    await putKeyVaultSecretInEnvVar();

    // still don't have a database url?
    if (!process.env.DATABASE_URL) {
      throw new Error("No value in DATABASE_URL in env var");
    }
  }

  // To override the database name, set the DATABASE_NAME environment variable in the .env file
  const DATABASE_NAME = process.env.DATABASE_NAME || "azure-todo-app";

  return {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_NAME: DATABASE_NAME,
  };
}

async function connect() {
  const host = await getSecret("host", "punchcodestudioskeyvault");
  const port = await getSecret("port", "punchcodestudioskeyvault");
  const dbname = await getSecret("dbname", "punchcodestudioskeyvault");
  const uname = await getSecret("uname", "punchcodestudioskeyvault");
  const password = await getSecret("password", "punchcodestudioskeyvault");

  mongoose
    .connect(
      "mongodb://" +
        host +
        ":" +
        port +
        "/" +
        dbname +
        "?ssl=true&replicaSet=globaldb",
      {
        auth: {
          username: uname,
          password: password,
        },
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: false,
      }
    )
    .then(() => console.log("Connection to CosmosDB successful"))
    .catch((err) => console.error(err));
}
module.exports = {
  getConnectionInfo,
  connect,
};

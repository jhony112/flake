import crypto from "crypto";
import path from "path";
import fs from "fs";
import { writeFileSync } from "fs";
import { generateKeyPairSync } from "crypto";
import JSEncrypt from "node-jsencrypt";

const algorithm = "aes-256-ctr";
const secret = process.env.JWT_SECRET;
const iv = crypto.randomBytes(16);

const encrypt = async (text) => {
  const key = (await sha256(secret)).substr(0, 32);
  const cipher = await crypto.createCipheriv(algorithm, key, iv);
  const encrypted = await Buffer.concat([cipher.update(text), cipher.final()]);
  return encrypted.toString("hex");
};

const decrypt = async (hash) => {
  const key = (await sha256(secret)).substr(0, 32);
  const decipher = await crypto.createCipheriv(algorithm, key, Buffer.from(hash.iv, "hex"));
  const decrypted = await Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
};

const md5 = async (text) => {
  return crypto.createHash("md5").update(text).digest("hex");
};

const sha256 = async (text) => {
  return crypto.createHash("sha256").update(String(text)).digest("hex");
};

const encryptRSA = async (text, publicKeyPath) => {
  const absolutePath = path.resolve(publicKeyPath);
  const publicKey = fs.readFileSync(absolutePath, "utf8");
  const buffer = Buffer.from(text);
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

const jsEncryptRSA = async (text, publicKeyPath) => {
  const absolutePath = path.resolve(publicKeyPath);
  const publicKey = fs.readFileSync(absolutePath, "utf8");
  const e = new JSEncrypt();
  e.setKey(publicKey);
  return e.encrypt(text);
};

const jsEncryptRSAWithPublicKey = async (text, publicKey) => {
  const e = new JSEncrypt();
  e.setKey(publicKey);
  return e.encrypt(text);
};

const jsDecryptRSA = function (encryptedText, privateKeyPath) {
  const absolutePath = path.resolve(privateKeyPath);
  const publicKey = fs.readFileSync(absolutePath, "utf8");
  const e = new JSEncrypt();
  e.setKey(publicKey);
  return e.decrypt(encryptedText);
};

const decryptRSA = function (encryptedText, privateKeyPath) {
  const absolutePath = path.resolve(privateKeyPath);
  const privateKey = fs.readFileSync(absolutePath, "utf8");
  const buffer = Buffer.from(encryptedText, "base64");
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf8");
};

function generateRSAKeys(privateKeyOutputFile = "private.pem", publicKeyOutputFile = "public.pem") {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "",
    },
  });

  writeFileSync(privateKeyOutputFile, privateKey);
  writeFileSync(publicKeyOutputFile, publicKey);
}

export {
  encrypt,
  decrypt,
  md5,
  sha256,
  encryptRSA,
  decryptRSA,
  generateRSAKeys,
  jsEncryptRSA,
  jsEncryptRSAWithPublicKey,
  jsDecryptRSA,
};

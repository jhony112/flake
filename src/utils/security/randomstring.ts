const randomstring = require("randomstring");
const { encrypt } = require("./EncDec");

// alphanumeric - [0-9 a-z A-Z]
// alphabetic - [a-z A-Z]
// numeric - [0-9]
// hex - [0-9 a-f]
// binary - [01]
// octal - [0-7]
// custom - any given characters

export type RandomCharSet = "alphanumeric" | "alphabetic" | "numeric" | "hex" | "binary" | "octal";
const generateChars = (
  length = 12,
  charset: RandomCharSet = "alphanumeric",
  capitalization?: "uppercase" | "lowercase",
  readable = true
) => {
  return randomstring.generate({ length, readable, charset, capitalization });
};

const generateUniqueCharsForColumn = async (
  model,
  column,
  length = 12,
  charset: RandomCharSet = "alphabetic"
) => {
  let exists;
  let string;
  do {
    string = generateChars(length, charset);
    exists = await model.findOne({ where: { [column]: string } });
  } while (exists);

  return string;
};

const generateMerchantKey = async (account_id, liveMode = false, publicKey = false) => {
  const salt = generateChars(6);
  return `${liveMode ? "live" : "test"}_${publicKey ? "pk" : "sk"}_${await encrypt(
    account_id + salt
  )}`;
};

const generateOTP = async () => {
  return generateChars(6, "numeric");
};

export { generateChars, generateOTP, generateUniqueCharsForColumn, generateMerchantKey };

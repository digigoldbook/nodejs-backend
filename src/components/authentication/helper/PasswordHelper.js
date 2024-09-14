import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const encryptPassword = (plainText) => {
  var hash = bcrypt.hashSync(plainText, salt);
  return hash;
};

const decryptPassword = (plainText, hash) => {
  var state = bcrypt.compareSync(plainText, hash); // value is true if match otherwise false
  return state;
};

export default { encryptPassword, decryptPassword };

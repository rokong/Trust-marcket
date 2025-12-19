// hashPassword.js
import bcrypt from "bcryptjs";

const plainPassword = "pass.33246733";

const generateHash = async () => {
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log("Copy this hash for MongoDB:", hash);
};

generateHash();

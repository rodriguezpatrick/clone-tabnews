import bcryptjs from "bcryptjs";

const pepper = process.env.PEPPER_SECRET;

async function hash(password) {
  const rounds = getNumberOfRounds();
  const passwordwithpepper = password + pepper;

  return await bcryptjs.hash(passwordwithpepper, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;

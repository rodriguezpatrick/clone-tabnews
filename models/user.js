import database from "infra/database.js";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/errors";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
              SELECT 
                * 
              FROM
                users 
              WHERE
                LOWER(username) = LOWER($1) 
              LIMIT
                1
              ;`,
      values: [username],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente",
      });
    }
    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
            INSERT INTO 
              users (username, email, password) 
            VALUES 
              ($1, $2, $3)
            RETURNING
              *
                ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if (
    "username" in userInputValues &&
    userInputValues.username.toLowerCase() !==
      currentUser.username.toLowerCase()
  ) {
    await validateUniqueUsername(userInputValues.username);
  }
  if (
    "email" in userInputValues &&
    userInputValues.email.toLowerCase() !== currentUser.email.toLowerCase()
  ) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };
  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
            UPDATE 
              users 
            SET 
              username = $2,
              email = $3,
              password = $4,
              updated_at = timezone('utc', now())
            WHERE
              id = $1
            RETURNING
              *
                ;`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });
    return results.rows[0];
  }
  //colocar um erro caso o valor enviado não tiver nenhuma dessas chaves
  // const updatedValues = await postUpdatedValues(currentUser, userInputValues);
  //return updatedValues;

  // async function postUpdatedValues(currentUser, userInputValues) {
  //   // Monta dinamicamente o SQL conforme os campos informados
  //   const fields = Object.keys(userInputValues);
  //   const values = Object.values(userInputValues);

  //   // Ex: ["username = $1", "email = $2"]
  //   const setClause = fields
  //     .map((field, i) => `${field} = $${i + 1}`)
  //     .join(", ");

  //   const results = await database.query({
  //     text: `
  //       UPDATE users
  //       SET ${setClause}
  //       WHERE username = $${fields.length + 1}
  //       RETURNING *;
  //     `,
  //     values: [...values, currentUser.username],
  //   });

  //   return results.rows[0];
  // }
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `
            SELECT 
              username 
            FROM
              users 
            WHERE
              LOWER(username) = LOWER($1) 
            ;`,
    values: [username],
  });
  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O nome de usuário informado já está cadastrado.",
      action: "Utilize outro username para realizar esta operação",
    });
  }
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
            SELECT 
              email 
            FROM
              users 
            WHERE
              LOWER(email) = LOWER($1) 
            ;`,
    values: [email],
  });
  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está cadastrado.",
      action: "Utilize outro email para realizar esta operação",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  update,
};

export default user;

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { userQueryByEmail, createUserDB, createSessionDB } from "../repositories/auth.repository.js";

export async function signUp(req, res) {
  const { name, photo, email, password } = req.body;

  try {
    const user = await userQueryByEmail(email);
    if (user.rowCount !== 0) return res.status(409).send({ message: "User already exists" });

    const encryptedPassword = bcrypt.hashSync(password, 10);

    await createUserDB(name, photo, email, encryptedPassword);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userQueryByEmail(email);
    if (user.rowCount === 0) return res.status(401).send({ message: "User not found" });

    const validPassword = bcrypt.compareSync(password, user.rows[0].password);
    if (!validPassword) return res.status(401).send({ message: "Invalid password" });

    const token = uuidv4();

    await createSessionDB(user.rows[0].id, token);

    res.status(200).send({ token });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

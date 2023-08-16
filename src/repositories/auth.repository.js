import { db } from "../database/database.connection.js";

export async function userQueryByEmail(email) {
  return db.query(`SELECT * FROM users WHERE mail=$1`, [email]);
}

export async function createUserDB(name, photo, email, encryptedPassword) {
  return db.query("INSERT INTO users (username, photo, mail, password) VALUES ($1, $2, $3, $4)", [name, photo, email, encryptedPassword]);
}

export function createSessionDB(userId, token) {
  return db.query(`INSERT INTO sessions (user_id, token) VALUES ($1, $2);`, [userId, token]);
}

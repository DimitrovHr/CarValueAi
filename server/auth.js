import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash a password string
 * @param {string} password The plain text password to hash
 * @returns {Promise<string>} A promise that resolves to the hashed password
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} plainTextPassword The plain text password to check
 * @param {string} hashedPassword The hashed password to compare against
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the passwords match
 */
export async function comparePassword(plainTextPassword, hashedPassword) {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
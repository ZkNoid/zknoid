import { Field, Group, PrivateKey, PublicKey } from 'o1js';

/**
 * Converts a number to an ElGamal message representation.
 * @param value The number to convert.
 * @returns An array representing the ElGamal message.
 */
export const convertToMessage = (value: number): [Group, Group, Group] => {
  return [Group.generator.scale(value), Group.generator, Group.zero];
};

/**
 * Encrypts a message using ElGamal encryption.
 * @param publicKey The public key for encryption.
 * @param message The message to encrypt.
 * @param randomValue The random value.
 * @returns An array representing the encrypted message.
 */
export const encrypt = (
  publicKey: PublicKey,
  message: [Group, Group, Group],
  randomValue: Field,
): [Group, Group, Group] => {
  let m0Add = Group.generator.scale(randomValue);
  let m1Add = publicKey.toGroup().scale(randomValue);

  let newMessage: [Group, Group, Group] = [
    m0Add.add(message[0]),
    m1Add.add(message[1]),
    Group.zero,
  ];
  return newMessage;
};

/**
 * Decrypts a single ElGamal ciphertext component.
 * @param privateKey The private key for decryption.
 * @param ciphertextComponent The ciphertext component to decrypt.
 * @returns The decrypted ciphertext component.
 */
export const decryptOne = (
  privateKey: PrivateKey,
  ciphertextComponent: Group,
): Group => {
  return ciphertextComponent.scale(privateKey.s);
};

/**
 * Decrypts an ElGamal ciphertext.
 * @param privateKey The private key for decryption.
 * @param ciphertext The ciphertext to decrypt.
 * @returns An array representing the decrypted ciphertext.
 */
export const decrypt = (
  privateKey: PrivateKey,
  ciphertext: [Group, Group, Group],
): [Group, Group, Group] => {
  let newCiphertext: [Group, Group, Group] = [
    ciphertext[0],
    ciphertext[1],
    ciphertext[2].add(ciphertext[0].scale(privateKey.s)),
  ];
  return newCiphertext;
};

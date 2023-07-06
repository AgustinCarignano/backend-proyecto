export default class CustomError {
  static generateError({ message, cause, name }) {
    const myError = new Error(message, { cause });
    myError.name = name;
    throw myError;
  }
}

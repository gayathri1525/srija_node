export class User {
  constructor(name, email, id) {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("User: name must be a non-empty string");
    }
    if (typeof email !== "string" || !email.includes("@")) {
      throw new Error("User: email must be valid");
    }
    this.name = name.trim();
    this.email = email.trim();
    this.id = id;
  }
}

export const users = [];

// Register a user 
let _idSeq = 200;
export function registerUser(name, email) {
  const user = new User(name, email, ++_idSeq);
  users.push(user);
  console.log(`User registered: ${user.name} (ID ${user.id})`);
  return user;
}

// Find by name 
export function findUserByName(name) {
  return users.find(u => u.name === name);
}

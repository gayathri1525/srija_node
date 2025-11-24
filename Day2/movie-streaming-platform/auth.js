const authenticate = async ({ username, password }) => {
  await new Promise(r => setTimeout(r, 200));
  const ok = username === "user@example.com" && password === "pass123";
  if (!ok) throw new Error("Invalid credentials");
  return { id: 202, email: username };
};

export default authenticate;

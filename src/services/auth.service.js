import api from "./api";

export const loginUser = async (data) => {
  const res = await api.get("/users");

  const user = res.data.find(
    (u) =>
      u.email === data.email &&
      u.password === data.password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return {
    token: "fake-jwt",
    role: user.role,
    id: user.id,
    email: user.email,
  };
};
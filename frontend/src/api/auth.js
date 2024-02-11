import { axiosInstance } from "./axios";

// TODO Crear peticiones para el registro y login de usuarios y verificacion

export const registerRequest = user => axiosInstance.post("/register", user);

export const loginRequest = user => axiosInstance.post("/login", user);

export const verifyTokenRequest = () => axiosInstance.get("/verify");

export const logoutRequest = () => axiosInstance.post("/logout");
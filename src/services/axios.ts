import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  auth: {
    username: "admin",
    password: "admin"
  }
});
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",     // Url for the backend API where the server is running
    withCredentials: true                     // Include credentials (cookies) in requests
});
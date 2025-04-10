import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",     // Url for the backend API where the server is running
    withCredentials: true                     // Include credentials (cookies) in requests
});
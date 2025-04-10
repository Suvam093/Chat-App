import express from 'express';
import {signup, login, logout, updateProfile, checkAuth} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.Middleware.js';

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile",protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth); // check if the user is logged in or not

export default router;
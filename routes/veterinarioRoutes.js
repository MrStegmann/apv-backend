import express from 'express';
import { profile, register, confirm, authenticate, forgetPass, checkToken, changePass, updateProfile, updatePass } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/auth.js';

const router = express.Router();

router.post('/', register);
router.get("/confirm/:token", confirm);
router.post("/login", authenticate);
router.post("/forgetPass", forgetPass);
router.route("/forgetPass/:token").get(checkToken).post(changePass);

//Secure
router.get('/profile', checkAuth, profile);
router.put("/profile/:id", checkAuth, updateProfile);
router.put("/updatePass", checkAuth, updatePass)

export default router;
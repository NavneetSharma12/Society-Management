import express from "express";
import { ChangePassword, editProfile, followOrUnfollow, ForgetPassword, getProfile, getSuggestedUsers, Login, Logout, register, SearchUser, refreshAccessToken } from "../Controller/User.Controller.js";
import isAuthenticated from "../Middlewares/IsAuthenticated.js";
import upload from "../Middlewares/multer.js";
const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(Login)
router.route("/logout").get(Logout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgetPassword/:email").post(ForgetPassword)
router.route("/changePassword").post(ChangePassword)
router.route("/:id/profile").get(isAuthenticated,getProfile)
router.route("/profile/edit").post(isAuthenticated,upload.single("profilePhoto"),editProfile)
router.route("/suggested").get(isAuthenticated,getSuggestedUsers)
router.route("/followOrUnfollow/:id").post(isAuthenticated,followOrUnfollow)
router.route("/searchUser/:name").get(isAuthenticated,SearchUser)

export  default router;

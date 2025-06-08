import express from "express";
import isAuthenticated from "../Middlewares/IsAuthenticated.js";
import upload from "../Middlewares/multer.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from "../Controller/Post.Controller.js";
const router = express.Router();

router.route("/addPost").post(isAuthenticated,upload.single("image"),addNewPost)
router.route("/all").get(isAuthenticated,getAllPost)
router.route("/userPost/all").get(isAuthenticated,getUserPost)
router.route("/:id/like").get(isAuthenticated,likePost)
router.route("/:id/dislike").get(isAuthenticated,dislikePost)
router.route("/:id/comment").post(isAuthenticated,addComment)
router.route("/:id/comment/all").post(isAuthenticated,getCommentsOfPost)
router.route("/delete/:id").delete(isAuthenticated,deletePost)
router.route("/:id/bookmark").post(isAuthenticated,bookmarkPost)



export  default router;

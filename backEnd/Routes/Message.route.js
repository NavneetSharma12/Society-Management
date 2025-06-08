import express from "express";
import isAuthenticated from "../Middlewares/IsAuthenticated.js";
import upload from "../Middlewares/multer.js";
import { getMessage, sendMessage } from "../Controller/message.controller.js";
const router = express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage)
router.route("/all/:id").post(isAuthenticated,getMessage)

export  default router;

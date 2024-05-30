import express from "express";
import authenticateToken from "../middlewares/authMiddleware";
import {example} from "../services/exampleService";

const examController = express.Router();

examController.get("/", authenticateToken, example);

export default examController;

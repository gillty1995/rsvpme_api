"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/:eventId", authMiddleware_1.verifyJWT, chatController_1.getChatMessages);
router.post("/:eventId", authMiddleware_1.verifyJWT, chatController_1.postChatMessage);
exports.default = router;

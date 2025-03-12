"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const PORT = process.env.PORT || 5005;
// ✅ Connect to the database BEFORE starting the server
(0, database_1.default)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("❌ Database connection failed", err);
    process.exit(1);
});

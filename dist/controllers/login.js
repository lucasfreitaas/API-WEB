"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const router = express_1.default.Router();
data_source_1.AppDataSource.initialize().then(() => {
    console.log("Conexão com o banco de dados realizada");
}).catch((error) => {
    console.log("Falha na conexão com o banco de dados", error);
});
router.get("/", (req, res) => {
    res.send("TESTE");
});
exports.default = router;

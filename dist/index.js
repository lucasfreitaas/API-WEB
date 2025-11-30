"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const AuthConttoller_1 = __importDefault(require("./controllers/AuthConttoller"));
const TestConnectionController_1 = __importDefault(require("./controllers/TestConnectionController"));
const SituationController_1 = __importDefault(require("./controllers/SituationController"));
const ProductsCategoriaController_1 = __importDefault(require("./controllers/ProductsCategoriaController"));
const ProductSitutationController_1 = __importDefault(require("./controllers/ProductSitutationController"));
const ProductsController_1 = __importDefault(require("./controllers/ProductsController"));
app.use('/', TestConnectionController_1.default);
app.use('/', AuthConttoller_1.default);
app.use('/', SituationController_1.default);
app.use('/', ProductsCategoriaController_1.default);
app.use('/', ProductSitutationController_1.default);
app.use('/', ProductsController_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});

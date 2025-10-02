"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Situations_1 = require("./entity/Situations");
const Users_1 = require("./entity/Users");
const dotenv_1 = __importDefault(require("dotenv"));
const Products_1 = require("./entity/Products");
const ProductCategoria_1 = require("./entity/ProductCategoria");
const ProductSituation_1 = require("./entity/ProductSituation");
dotenv_1.default.config();
const dialect = (_a = process.env.DB_DIALECT) !== null && _a !== void 0 ? _a : "mysql";
exports.AppDataSource = new typeorm_1.DataSource({
    type: dialect,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situations_1.Situations, Users_1.User, Products_1.Product, ProductCategoria_1.ProductCategoria, ProductSituation_1.ProductSituation],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
});
exports.AppDataSource.initialize().then(() => {
    console.log("Conexão com o banco de dados realizada");
}).catch((error) => {
    console.log("Falha na conexão com o banco de dados", error);
});

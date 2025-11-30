"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const yup = __importStar(require("yup"));
const PaginationService_1 = require("../services/PaginationService");
const Products_1 = require("../entity/Products");
const typeorm_1 = require("typeorm");
const router = express_1.default.Router();
router.get("/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("➡️ Entrou na rota /productproduct");
    try {
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        console.log("📦 Repository carregado:", productRepository.metadata.tableName);
        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;
        console.log(`📄 page=${page}, limite=${limite}`);
        const result = yield PaginationService_1.PaginationService.paginate(productRepository, page, limite, { id: "DESC" });
        console.log("✅ Paginate retornou", result);
        res.status(200).json(result);
        return;
    }
    catch (error) {
        console.error("❌ Erro na rota /product:", error);
        res.status(500).json({
            mensagem: "Erro ao listar produto!"
        });
        return;
    }
}));
router.get("/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = yield productRepository.findOneBy({ id: parseInt(id) });
        if (!product) {
            res.status(404).json({
                mensagem: "Produto não encontrado!"
            });
            return;
        }
        res.status(200).json(product);
        return;
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao visualizar produto!"
        });
        return;
    }
}));
router.post("/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var data = req.body;
        const schema = yup.object().shape({
            name: yup.string()
                .required("O campo nome é obrigatório!")
                .min(3, "O campo nome deve ter no mínimo 3 caracteres")
        });
        yield schema.validate(data, { abortEarly: false });
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const existingSituation = yield productRepository.findOne({
            where: { name: data.name }
        });
        if (existingSituation) {
            res.status(400).json({
                mensagem: "Já existe um produto cadastrado com esse nome!"
            });
            return;
        }
        const newProduct = productRepository.create(data);
        yield productRepository.save(newProduct);
        res.status(201).json({
            mensagem: "produto cadastrado com sucesso!",
            Product: newProduct,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                mensagem: error.errors
            });
            return;
        }
        console.error("❌ Erro ao cadastrar produto:", error);
        res.status(500).json({
            mensagem: "Erro ao cadastrar produto!",
        });
    }
}));
router.put("/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        var data = req.body;
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = yield productRepository.findOneBy({ id: parseInt(id) });
        const existingSituation = yield productRepository.findOne({
            where: {
                name: data.name,
                id: (0, typeorm_1.Not)(parseInt(id))
            }
        });
        if (existingSituation) {
            res.status(400).json({
                mensagem: "Já existe um produto cadastrado com esse nome!"
            });
            return;
        }
        if (!product) {
            res.status(404).json({
                mensagem: "produto não encontrada!"
            });
            return;
        }
        productRepository.merge(product, data);
        const updateproduct = yield productRepository.save(product);
        res.status(200).json({
            mensagem: "produto atualizada com sucesso!",
            Products: updateproduct,
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar produto!"
        });
        return;
    }
}));
router.delete("/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = yield productRepository.findOneBy({ id: parseInt(id) });
        if (!product) {
            res.status(404).json({
                mensagem: "Produto não encontrado!"
            });
            return;
        }
        yield productRepository.remove(product);
        res.status(200).json({
            mensagem: "produto removido com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao remover produto!"
        });
        return;
    }
}));
exports.default = router;

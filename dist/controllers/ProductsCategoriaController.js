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
const ProductCategoria_1 = require("../entity/ProductCategoria");
const typeorm_1 = require("typeorm");
const router = express_1.default.Router();
router.get("/productCategoria", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("➡️ Entrou na rota /productCategoria");
    try {
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        console.log("📦 Repository carregado:", categoriaRepository.metadata.tableName);
        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;
        console.log(`📄 page=${page}, limite=${limite}`);
        const result = yield PaginationService_1.PaginationService.paginate(categoriaRepository, page, limite, { id: "DESC" });
        console.log("✅ Paginate retornou", result);
        res.status(200).json(result);
        return;
    }
    catch (error) {
        console.error("❌ Erro na rota /productCategoria:", error);
        res.status(500).json({
            mensagem: "Erro ao listar categorias!"
        });
        return;
    }
}));
router.get("/productCategoria/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const categoria = yield categoriaRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Categoria não encontrada!"
            });
            return;
        }
        res.status(200).json(categoria);
        return;
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao visualizar categoria!"
        });
        return;
    }
}));
router.post("/productCategoria", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var data = req.body;
        const schema = yup.object().shape({
            name: yup.string()
                .required("O campo nome é obrigatório!")
                .min(3, "O campo nome deve ter no mínimo 3 caracteres")
        });
        yield schema.validate(data, { abortEarly: false });
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const existingSituation = yield categoriaRepository.findOne({
            where: { name: data.name }
        });
        if (existingSituation) {
            res.status(400).json({
                mensagem: "Já existe uma categoria com esse nome!"
            });
            return;
        }
        const newCategoria = categoriaRepository.create(data);
        yield categoriaRepository.save(newCategoria);
        res.status(201).json({
            mensagem: "Categoria cadastrada com sucesso!",
            situation: newCategoria,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                mensagem: error.errors
            });
            return;
        }
        console.error("❌ Erro ao cadastrar categoria:", error);
        res.status(500).json({
            mensagem: "Erro ao cadastrar categoria!",
        });
    }
}));
router.put("/productCategoria/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        var data = req.body;
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const existingSituation = yield categoriaRepository.findOne({
            where: {
                name: data.name,
                id: (0, typeorm_1.Not)(parseInt(id))
            }
        });
        if (existingSituation) {
            res.status(400).json({
                mensagem: "Já existe uma categoria com esse nome!"
            });
            return;
        }
        const categoria = yield categoriaRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Categoria não encontrada!"
            });
            return;
        }
        categoriaRepository.merge(categoria, data);
        const updateCategoria = yield categoriaRepository.save(categoria);
        res.status(200).json({
            mensagem: "Categoria atualizada com sucesso!",
            situations: updateCategoria,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                mensagem: error.errors
            });
            return;
        }
        res.status(500).json({
            mensagem: "Erro ao atualizar categoria!"
        });
        return;
    }
}));
router.delete("/productCategoria/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const categoria = yield categoriaRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Categoria não encontrada!"
            });
            return;
        }
        yield categoriaRepository.remove(categoria);
        res.status(200).json({
            mensagem: "Categoria removida com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao remover categoria!"
        });
        return;
    }
}));
exports.default = router;

"use strict";
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
const PaginationService_1 = require("../services/PaginationService");
const ProductSituation_1 = require("../entity/ProductSituation");
const router = express_1.default.Router();
router.get("/productSituation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("➡️ Entrou na rota /productCategoria");
    try {
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        console.log("📦 Repository carregado:", situationRepository.metadata.tableName);
        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;
        console.log(`📄 page=${page}, limite=${limite}`);
        const result = yield PaginationService_1.PaginationService.paginate(situationRepository, page, limite, { id: "DESC" });
        console.log("✅ Paginate retornou", result);
        res.status(200).json(result);
        return;
    }
    catch (error) {
        console.error("❌ Erro na rota /productCategoria:", error);
        res.status(500).json({
            mensagem: "Erro ao listar situações!"
        });
        return;
    }
}));
router.get("/productSituation/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const situation = yield situationRepository.findOneBy({ id: parseInt(id) });
        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }
        res.status(200).json(situation);
        return;
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao visualizar situação!"
        });
        return;
    }
}));
router.post("/productSituation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var data = req.body;
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const newSituation = situationRepository.create(data);
        yield situationRepository.save(newSituation);
        res.status(201).json({
            mensagem: "Situação cadastrada com sucesso!",
            situation: newSituation,
        });
    }
    catch (error) {
        console.error("❌ Erro ao cadastrar situação:", error);
        res.status(500).json({
            mensagem: "Erro ao cadastrar situação!",
        });
    }
}));
router.put("/productSituation/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        var data = req.body;
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const categoria = yield situationRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }
        situationRepository.merge(categoria, data);
        const updateCategoria = yield situationRepository.save(categoria);
        res.status(200).json({
            mensagem: "Situação atualizada com sucesso!",
            situations: updateCategoria,
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar situação!"
        });
        return;
    }
}));
router.delete("/productSituation/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const categoria = yield situationRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }
        yield situationRepository.remove(categoria);
        res.status(200).json({
            mensagem: "Situação removida com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao remover situação!"
        });
        return;
    }
}));
exports.default = router;

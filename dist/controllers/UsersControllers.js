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
const Users_1 = require("../entity/Users");
const PaginationService_1 = require("../services/PaginationService");
const yup = __importStar(require("yup"));
const typeorm_1 = require("typeorm");
const router = express_1.default.Router();
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = yield PaginationService_1.PaginationService.paginate(userRepository, page, limit, { id: "DESC" });
        res.status(200).json(result);
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao listar os usuários!",
        });
        return;
    }
}));
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        const user = yield userRepository.findOneBy({ id: parseInt(id) });
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }
        res.status(200).json(user);
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao visualizar o usuário!",
        });
    }
}));
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var data = req.body;
        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
            email: yup.string().email("E-mail inválido").required("O campo e-mail é obrigatório"),
            situation: yup.number().required("O campo situação é obrigatório"),
        });
        yield schema.validate(data, { abortEarly: false });
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        const existingUser = yield userRepository.findOne({
            where: { email: data.email }
        });
        if (existingUser) {
            res.status(400).json({
                message: "Já existe um usuário cadastro com esse e-mail",
            });
            return;
        }
        const newUser = userRepository.create(data);
        yield userRepository.save(newUser);
        res.status(201).json({
            message: "Usuário cadastro com sucesso!",
            situation: newUser,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({
                message: "Falha na validação dos dados",
                errors: error.errors,
                fields: error.inner.map(e => ({ path: e.path, message: e.message }))
            });
        }
        console.error(error);
        return res.status(500).json({ message: "Erro interno ao cadastrar o usuário" });
    }
}));
router.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatorio!").min(3, "O campo nome deve ter no mínimo 3 caraceres"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
            situation: yup.number().required("O campo situação é obrigatório!"),
        });
        yield schema.validate(data, { abortEarly: false });
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        const user = yield userRepository.findOneBy({ id: parseInt(id) });
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }
        const existingUser = yield userRepository.findOne({
            where: {
                email: data.email,
                id: (0, typeorm_1.Not)(parseInt(id)),
            },
        });
        if (existingUser) {
            res.status(400).json({
                message: "Já existe um usuário cadastrado com esse nome!",
            });
            return;
        }
        userRepository.merge(user, data);
        const updateUser = yield userRepository.save(user);
        res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            user: updateUser
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        res.status(500).json({
            message: "Erro ao editar usuário!",
        });
    }
}));
router.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        const user = yield userRepository.findOneBy({ id: parseInt(id) });
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }
        yield userRepository.remove(user);
        res.status(200).json({
            message: "Usuário apagado com sucesso!"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao apagar o usuário!",
        });
    }
}));
exports.default = router;

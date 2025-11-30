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
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../entity/Users");
const Situations_1 = require("../entity/Situations");
class CreateUsersSeeds {
    run(dataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Iniciandoi o seed para a tabela 'users'...");
            const userRepository = dataSource.getRepository(Users_1.User);
            const situationRepository = dataSource.getRepository(Situations_1.Situations);
            const existingCount = yield userRepository.count();
            if (existingCount > 0) {
                console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
                return;
            }
            const situation = yield situationRepository.findOne({ where: { id: 1 } });
            if (!situation) {
                console.error("Erro: Nenhuma situação encontrada com ID 1. Verifique se a tabela 'situations' está populada.");
                return;
            }
            const users = [
                {
                    id: 1,
                    name: "Ricardo Gabriel",
                    email: "ricardo@ricardo.com.br",
                    situation: situation,
                },
                {
                    id: 2,
                    name: "Pedro",
                    email: "pedro@ricardo.com.br",
                    situation: situation,
                },
            ];
            yield userRepository.save(users);
            console.log("Seed concluído com sucesso: usuarios cadastrados!");
        });
    }
}
exports.default = CreateUsersSeeds;

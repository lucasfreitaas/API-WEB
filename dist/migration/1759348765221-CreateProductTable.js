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
exports.CreateProductTable1759348765221 = void 0;
const typeorm_1 = require("typeorm");
class CreateProductTable1759348765221 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "productCategoryId",
                        type: "int",
                    },
                    {
                        name: "productSituationId",
                        type: "int",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }));
            //CRIAR CHAVE ESTRANGEIRA
            yield queryRunner.createForeignKey("products", new typeorm_1.TableForeignKey({
                columnNames: ["productCategoryId"],
                referencedTableName: "productCategoria",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
            yield queryRunner.createForeignKey("products", new typeorm_1.TableForeignKey({
                columnNames: ["productSituationId"],
                referencedTableName: "productSituation",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("products");
            // Verifica e remove a foreign key de productCategoryId
            const categoryForeignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.includes("productCategoryId"));
            if (categoryForeignKey) {
                yield queryRunner.dropForeignKey("products", categoryForeignKey);
            }
            // Verifica e remove a foreign key de productSituationId
            const situationForeignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.includes("productSituationId"));
            if (situationForeignKey) {
                yield queryRunner.dropForeignKey("products", situationForeignKey);
            }
            // Remove a tabela
            yield queryRunner.dropTable("products");
        });
    }
}
exports.CreateProductTable1759348765221 = CreateProductTable1759348765221;

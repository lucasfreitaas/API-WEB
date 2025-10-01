import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductSituationTable1759348682150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(new Table({
                name: "productSituation",
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
                        type: "varchar",
                        isUnique: true,
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
        }
    
        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropTable("productSituation")
        }
    

}

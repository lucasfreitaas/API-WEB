import "reflect-metadata"
import { DataSource } from "typeorm"
import { Situations } from "./entity/Situations";
import { User} from "./entity/Users";

import dotenv from "dotenv";
import { Product } from "./entity/Products";
import { ProductCategoria } from "./entity/ProductCategoria";
import { ProductSituation } from "./entity/ProductSituation";

dotenv.config(); 

    const dialect = process.env.DB_DIALECT ?? "mysql";
export const AppDataSource = new DataSource({
    type: dialect as "mysql" | "mariadb" | "postgres" | "mongodb",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situations, User, Product, ProductCategoria, ProductSituation],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
});

AppDataSource.initialize().then(()=>{
    console.log("Conexão com o banco de dados realizada")
}).catch((error)=>{
    console.log("Falha na conexão com o banco de dados", error)
})

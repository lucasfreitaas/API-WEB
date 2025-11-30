import express from "express";

import dotenv from "dotenv";

import cors from 'cors';

dotenv.config(); 

const app = express()

app.use(express.json());
app.use(cors());

import AuthController from "./controllers/AuthConttoller";
import TestConnectionController from "./controllers/TestConnectionController";
import UsersController from "./controllers/UsersControllers";
import SituationController from "./controllers/SituationController";
import ProductCategoriaController from "./controllers/ProductsCategoriaController";
import ProductSitutationController from "./controllers/ProductSitutationController";
import ProductsController from "./controllers/ProductsController";

app.use('/', TestConnectionController)
app.use('/', AuthController)
app.use('/', TestConnectionController);
app.use('/', AuthController);
app.use('/', UsersController);
app.use('/', SituationController)
app.use('/', ProductCategoriaController);
app.use('/', ProductSitutationController);
app.use('/', ProductsController);

app.listen(process.env.PORT, ()=> {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
})

function __importDefault(arg0: any) {
    throw new Error("Function not implemented.");
}

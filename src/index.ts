import express from "express";

import dotenv from "dotenv";

dotenv.config(); 

const app = express()

app.use(express.json());

import AuthController from "./controllers/AuthConttoller";
import SituationController from "./controllers/SituationController";
import ProductCategoriaController from "./controllers/ProductsCategoriaController";
import ProductSitutationController from "./controllers/ProductSitutationController";
import ProductsController from "./controllers/ProductsController";

app.use('/', AuthController)
app.use('/', SituationController)
app.use('/', ProductCategoriaController);
app.use('/', ProductSitutationController);
app.use('/', ProductsController);

app.listen(process.env.PORT, ()=> {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
})
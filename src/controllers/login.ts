import express, {Request, Response} from "express";

import { AppDataSource } from "../data-source";
import { error } from "console";

const router = express.Router();

AppDataSource.initialize().then(()=>{
    console.log("Conexão com o banco de dados realizada")
}).catch((error)=>{
    console.log("Falha na conexão com o banco de dados", error)
})

router.get("/", (req:Request, res:Response) =>{
    res.send("TESTE")
})

export default router
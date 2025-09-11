import express, {Request, Response} from "express";

const app = express()


app.get("/", (req:Request, res:Response) =>{
    res.send("EEEEEEEEEEEEE")
})

app.listen(8080, ()=> {
    console.log("Servidor iniciado: http://localhost:8080")
})
import { error } from "console";
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situations } from "../entity/Situations";

const router = express.Router();

router.get("/situations", async (req:Request, res:Response) =>{
    try{
        const situationRepository = AppDataSource.getRepository(Situations);

        const situations = await situationRepository.find();

        res.status(200).json(situations);
        return
        
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao listar situações!"
        });
        return
    }
})

router.get("/situations/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const situationRepository = AppDataSource.getRepository(Situations);

        const situations = await situationRepository.findOneBy({id : parseInt(id)});

        if(!situations){
            res.status(404).json({
            mensagem: "Situação não encontrada!"
             });
            return
        }

        res.status(200).json(situations);
        return

    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao visualizar situação!"
        });
        return
    }
})

router.post("/situations", async(req:Request, res:Response) =>{
    
    try{
        
        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situations);
        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            mensagem : "Situação cadastrada com sucesso!",
            situation: newSituation,
        });

    } catch(error){
        res.status(500).json({
            mensagem : "Erro ao cadastrar situação!",
        });
    }
})

router.put("/situations/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situations);

        const situations = await situationRepository.findOneBy({id : parseInt(id)});

        if(!situations){
            res.status(404).json({
            mensagem: "Situação não encontrada!"
             });
            return
        }

        situationRepository.merge(situations, data);

        const updateSituation = await situationRepository.save(situations);

        res.status(200).json({
            mensagem: "Situação atualizada com sucesso!",
            situations: updateSituation,
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao atualizar situação!"
        });
        return
    }
})

router.delete("/situations/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const situationRepository = AppDataSource.getRepository(Situations);

        const situations = await situationRepository.findOneBy({id : parseInt(id)});

        if(!situations){
            res.status(404).json({
            mensagem: "Situação não encontrada!"
             });
            return
        }

        await situationRepository.remove(situations);

        res.status(200).json({
            mensagem: "Situação removida com sucesso!",
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao remover situação!"
        });
        return
    }
})

export default router
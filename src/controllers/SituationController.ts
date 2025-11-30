import { error } from "console";
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situations } from "../entity/Situations";
import { checkPrimeSync } from "crypto";
import * as yup from 'yup';
import { PaginationService } from "../services/PaginationService";
import { Not } from "typeorm";

const router = express.Router();

router.get("/situations", async (req:Request, res:Response) =>{
    console.log("➡️ Entrou na rota /situations");
    try{ 
        const situationRepository = AppDataSource.getRepository(Situations);
        console.log("📦 Repository carregado:", situationRepository.metadata.tableName);

        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        console.log(`📄 page=${page}, limite=${limite}`);

        const result = await PaginationService.paginate(situationRepository, page, limite, {id: "DESC"});
        console.log("✅ Paginate retornou", result);

        res.status(200).json(result);
        return;
        
    } catch(error){
        console.error("❌ Erro na rota /situations:", error);
        res.status(500).json({
            mensagem: "Erro ao listar situações!"
        });
        return;
    }
});

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

        const schema = yup.object().shape({
            nameSituation: yup.string()
            .required("O campo nome é obrigatório!")
            .min(3, "O campo nome deve ter no mínimo 3 caracteres")
        })

        await schema.validate(data, {abortEarly: false})

        const situationRepository = AppDataSource.getRepository(Situations);

        const existingSituation = await situationRepository.findOne({
            where : {nameSituation: data.nameSituation}
        })

        if(existingSituation){
            res.status(400).json({
                mensagem: "Já existe uma situação cadastrada com esse nome!"
            })
            return
        }

        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            mensagem : "Situação cadastrada com sucesso!",
            situation: newSituation,
        });

    } catch(error){

        if(error instanceof yup.ValidationError){
            res.status(400).json({
            mensagem : error.errors
        });
        return;
        }
        

        res.status(500).json({
            mensagem : "Erro ao cadastrar situação!",
        });
    }
})

router.put("/situations/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        var data = req.body;

        const schema = yup.object().shape({
            nameSituation: yup.string()
            .required("O campo nome é obrigatório!")
            .min(3, "O campo nome deve ter no mínimo 3 caracteres")
        })

        await schema.validate(data, {abortEarly: false})


        const situationRepository = AppDataSource.getRepository(Situations);

        const situations = await situationRepository.findOneBy({id : parseInt(id)});

        const existingSituation = await situationRepository.findOne({
            where : {
                nameSituation: data.nameSituation,
                id: Not(parseInt(id))
            }
        })

        if(existingSituation){
            res.status(400).json({
                mensagem: "Já existe uma situação cadastrada com esse nome!"
            })
            return
        }

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
        if(error instanceof yup.ValidationError){
            res.status(400).json({
            mensagem : error.errors
        });
        return;
        }

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
import { error } from "console";
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { checkPrimeSync } from "crypto";
import { PaginationService } from "../services/PaginationService";
import { Product } from "../entity/Products";

const router = express.Router();

router.get("/product", async (req:Request, res:Response) =>{
    console.log("➡️ Entrou na rota /productproduct");
    try{ 
        const productRepository = AppDataSource.getRepository(Product);
        console.log("📦 Repository carregado:", productRepository.metadata.tableName);

        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        console.log(`📄 page=${page}, limite=${limite}`);

        const result = await PaginationService.paginate(productRepository, page, limite, {id: "DESC"});
        console.log("✅ Paginate retornou", result);

        res.status(200).json(result);
        return;
        
    } catch(error){
        console.error("❌ Erro na rota /product:", error);
        res.status(500).json({
            mensagem: "Erro ao listar produto!"
        });
        return;
    }
});

router.get("/product/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({id : parseInt(id)});

        if(!product){
            res.status(404).json({
            mensagem: "Produto não encontrado!"
             });
            return
        }

        res.status(200).json(product);
        return

    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao visualizar produto!"
        });
        return
    }
})

router.post("/product", async(req:Request, res:Response) =>{
    
    try{
        var data = req.body;

        const productRepository = AppDataSource.getRepository(Product);
        const newProduct = productRepository.create(data);

        await productRepository.save(newProduct);

        res.status(201).json({
            mensagem : "produto cadastrado com sucesso!",
            Product: newProduct,
        });
    } catch(error){
        console.error("❌ Erro ao cadastrar produto:", error);
        res.status(500).json({
            mensagem : "Erro ao cadastrar produto!",
        });
    }
})

router.put("/product/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        var data = req.body;

        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({id : parseInt(id)});

        if(!product){
            res.status(404).json({
            mensagem: "produto não encontrada!"
             });
            return
        }

        productRepository.merge(product, data);

        const updateproduct = await productRepository.save(product);

        res.status(200).json({
            mensagem: "produto atualizada com sucesso!",
            Products: updateproduct,
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao atualizar produto!"
        });
        return
    }
})

router.delete("/product/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({id : parseInt(id)});

        if(!product){
            res.status(404).json({
            mensagem: "Produto não encontrado!"
             });
            return
        }

        await productRepository.remove(product);

        res.status(200).json({
            mensagem: "produto removido com sucesso!",
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao remover produto!"
        });
        return
    }
})

export default router
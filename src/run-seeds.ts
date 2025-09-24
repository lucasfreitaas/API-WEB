import { AppDataSource } from "./data-source"
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";

const runSeeds = async() => {
    console.log("Conectando ao banco de dados")
    await AppDataSource.initialize();
    console.log("Banco de dados conectado")

    try{
        const situationSeeds = new CreateSituationsSeeds();
        await situationSeeds.run(AppDataSource)
    } catch(error){
        console.log("Erro ao conectar o seed:", error)
    } finally {
        await AppDataSource.destroy();
        console.log("Conexão com banco de dados encerrada")
    }
};

runSeeds()
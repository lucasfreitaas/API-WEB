import { AppDataSource } from "./data-source"
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";
import CreateUsersSeeds from "./seeds/CreateUsersSeed";

const runSeeds = async() => {
    console.log("Conectando ao banco de dados")
    await AppDataSource.initialize();
    console.log("Banco de dados conectado")

    try{
        const situationSeeds = new CreateSituationsSeeds();
        const userSeed = new CreateUsersSeeds();
        await situationSeeds.run(AppDataSource)
        await userSeed.run(AppDataSource);
        
    } catch(error){
        console.log("Erro ao conectar o seed:", error)
    } finally {
        await AppDataSource.destroy();
        console.log("Conexão com banco de dados encerrada")
    }
};

runSeeds()
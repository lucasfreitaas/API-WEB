import { DataSource } from "typeorm";
import { User } from "../entity/Users";
import { Situations } from "../entity/Situations";

export default class CreateUsersSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciandoi o seed para a tabela 'users'...");

    const userRepository = dataSource.getRepository(User);
    const situationRepository = dataSource.getRepository(Situations);

    const existingCount = await userRepository.count();
    if (existingCount > 0) {
      console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
      return;
    }

    const situation = await situationRepository.findOne({ where: { id: 1 } });

    if (!situation) {
      console.error("Erro: Nenhuma situação encontrada com ID 1. Verifique se a tabela 'situations' está populada.");
      return;
    }

    const users = [
      {
        id: 1,
        name: "Ricardo Gabriel",
        email: "ricardo@ricardo.com.br",
        situation: situation,
      },
      {
        id: 2,
        name: "Pedro",
        email: "pedro@ricardo.com.br",
        situation: situation,
      },
    ];

    await userRepository.save(users);
    console.log("Seed concluído com sucesso: usuarios cadastrados!")
  }
}
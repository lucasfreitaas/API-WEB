import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/Users";
import { PaginationService } from "../services/PaginationService";
import * as yup from 'yup';
import { Not } from "typeorm";

const router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
  try{
    const userRepository = AppDataSource.getRepository(User);

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const result = await PaginationService.paginate(userRepository, page, limit, { id: "DESC" });

    res.status(200).json(result);
    return;
  } catch(error){
    res.status(500).json({
      message: "Erro ao listar os usuários!",
    });
    return;
  } 
});
router.get("/users/:id", async (req: Request, res: Response) => {
  try{
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(User)

    const user = await userRepository.findOneBy({ id: parseInt(id!) });

    if(!user){
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    res.status(200).json(user);
    return;
  
  } catch(error){
    res.status(500).json({
      message: "Erro ao visualizar o usuário!",
    });
  }
});

router.post("/users", async (req: Request, res: Response) => {
  
  try{
    var data = req.body;

    const schema = yup.object().shape({
      name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
      email: yup.string().email("E-mail inválido").required("O campo e-mail é obrigatório"),
      situation: yup.number().required("O campo situação é obrigatório"),
    });

    await schema.validate(data, { abortEarly: false });

    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: { email: data.email }
    });

    if(existingUser){
      res.status(400).json({
        message: "Já existe um usuário cadastro com esse e-mail",
      });
      return;
    }

    const newUser = userRepository.create(data);

    await userRepository.save(newUser);

    res.status(201).json({
      message: "Usuário cadastro com sucesso!",
      situation: newUser,
    });
  }
  catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          message: "Falha na validação dos dados",
          errors: error.errors, 
          fields: error.inner.map(e => ({ path: e.path, message: e.message }))
        });
      }
  
      console.error(error);
      return res.status(500).json({ message: "Erro interno ao cadastrar o usuário" });
    }
  
});

router.put("/users/:id", async (req: Request, res: Response) => {

  try{
    const { id } = req.params;

    const data = req.body;

    const schema = yup.object().shape({
      name: yup.string().required("O campo nome é obrigatorio!").min(3, "O campo nome deve ter no mínimo 3 caraceres"),
      email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
      situation: yup.number().required("O campo situação é obrigatório!"),
    });

    await schema.validate(data, { abortEarly: false });

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: parseInt(id!) });

    if(!user){
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    const existingUser = await userRepository.findOne({
      where: {
        email: data.email,
        id: Not(parseInt(id!)),
      },
    });

    if(existingUser){
      res.status(400).json({
        message: "Já existe um usuário cadastrado com esse nome!",
      });
      return;
    }

    userRepository.merge(user, data);

    const updateUser = await userRepository.save(user);

    res.status(200).json({
      message: "Usuário atualizado com sucesso!",
      user: updateUser
    });
  
  }catch(error){
    if(error instanceof yup.ValidationError){
      res.status(400).json({
        message: error.errors
      });
      return;
    }

    res.status(500).json({
      message: "Erro ao editar usuário!",
    });
  }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  try{
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: parseInt(id!)});

    if(!user){
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    await userRepository.remove(user);

    res.status(200).json({
      message: "Usuário apagado com sucesso!"
    });

  }catch (error){
    res.status(500).json({
      message: "Erro ao apagar o usuário!",
    });
  }
});

export default router;
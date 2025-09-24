import { ObjectLiteral, Repository, FindOptionsOrder } from "typeorm";

interface PaginationResult<T>{
    error: boolean;
    data:T[];
    currentPage: number;
    lastPage: number;
    totalRecords: number;
}

export class PaginationService{
    static async paginate<T extends ObjectLiteral>(
        repository:Repository<T>,
        page: number = 1,
        limite: number = 10,
        order: FindOptionsOrder<T> = {}
    ):Promise<PaginationResult<T>>{

        const totalRecords = await repository.count();

        const lastPage = Math.ceil(totalRecords / limite);

        if(page > lastPage && lastPage > 0){
            throw new Error(`Página inválida. Total de páginas: ${lastPage}`)
        }

        const offset = (page - 1) * limite;

        const data = await repository.find({
            take: limite,
            skip: offset,
            order,
        });

        return{
            error: false,
            data,
            currentPage: page,
            lastPage,
            totalRecords
        }
    }
}
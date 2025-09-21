import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm"
import { Situations } from "./Situations"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    nome!: string

    @Column({unique : true})
    email!: string
    
    @ManyToOne(() => Situations, (situations) => situations.users)
    @JoinColumn({name: "situationId"})
    situation!: Situations;

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
    createdAt!: Date

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"} )
    updatedAt!: Date
}
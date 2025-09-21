import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from "./Users"

@Entity("situations")
export class Situations {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    nameSituation!: string

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
    createdAt!: Date

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"} )
    updatedAt!: Date

     @OneToMany(() => User, (user) => user.situation)
     users!: User
}
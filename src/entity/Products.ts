import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToMany, ManyToOne } from "typeorm"
import { ProductCategoria } from "./ProductCategoria";
import { ProductSituation } from "./ProductSituation";

@Entity("products")
export class Product{
  @PrimaryGeneratedColumn()
  id!: number

  @Column({unique: true})
  name!: string;

  @ManyToOne(() => ProductCategoria, (productCategoria) => productCategoria.products)
  @JoinColumn({name: "productCategoryId" })
  productCategoryId!: ProductCategoria;

  @ManyToOne(() => ProductSituation, (productSituation) => productSituation.products)
  @JoinColumn({name: "productSituationId"})
  productSituationId!: ProductSituation;

  @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

  @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
  updatedAt!: Date;
}
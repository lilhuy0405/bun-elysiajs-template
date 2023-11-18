import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"
import {AppRole} from "../enum";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  salt: string

  @Column()
  password: string

  @Column({
    default: AppRole.USER,
    type: "varchar",
  })
  role: AppRole

}

import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

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

}

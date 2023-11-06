import {AppDataSource} from "../data-source";
import {Repository} from "typeorm";
import {User} from "../entity/User";

class UserService {
  private _userRepository: Repository<User>

  constructor() {
    this._userRepository = AppDataSource.getRepository(User)
  }

  async create(user: User): Promise<User> {
    return await this._userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this._userRepository.findOne({
      where: {
        username: username
      }
    });
  }

  async findById(userId: any) {
    return await this._userRepository.findOne({
      where: {
        id: userId
      }
    });
  }
}

export default UserService

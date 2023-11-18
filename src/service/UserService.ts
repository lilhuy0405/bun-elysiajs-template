import {AppDataSource} from "../data-source";
import {Repository} from "typeorm";
import {User} from "../entity/User";
import {comparePassword, hashPassword} from "../util";
import {AppRole} from "../enum";

class UserService {
  private _userRepository: Repository<User>
  private static instance: UserService;

  constructor() {
    this._userRepository = AppDataSource.getRepository(User)
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async register(username: string, password: string) {
    if (!username || !password) {
      throw new Error("Username or password is empty");
    }
    const user = await this._userRepository.findOne({
      where: {
        username: username
      }
    });
    if (user) {
      throw new Error("Username is exists");
    }
    //hash password
    const {hash, salt} = await hashPassword(password);
    const newUser = new User();
    newUser.username = username;
    newUser.password = hash;
    newUser.salt = salt;
    newUser.role = AppRole.USER;
    const created = await this._userRepository.save(user);
    //remove password and salt
    delete created.password;
    delete created.salt;
    return created;
  }

  async login(username: string, password: string, jwt: any) {
    if (!username || !password) {
      throw new Error("Username or password is empty");
    }
    const user = await this._userRepository.findOne({
      where: {
        username: username
      }
    });
    if (!user) {
      throw new Error("Username not found");
    }
    const {salt, password: hash} = user;
    const isPasswordMatch = await comparePassword(password, salt, hash);
    if (!isPasswordMatch) {
      throw new Error("Password is incorrect");
    }
    //generate token
    const accessToken = await jwt.sign({
      userId: user.id,
    });
    const refreshToken = await jwt.sign({
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username
      }
    }
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

import {Elysia, t} from "elysia";
import {UserService} from "../service";
import {User} from "../entity/User";
import {comparePassword, hashPassword} from "../util";
import {isAuthenticated} from "../middleware/authMiddleware";

const userService = new UserService();
const auth = (app: any) => {
  return app.group("/auth", (app: typeof Elysia) => {
    app.post("/register", async ({body, set}) => {
      const {username, password} = body;
      if (!username || !password) {
        set.status = 400;
        return {
          message: "Username or password is empty"
        }
      }
      const user = await userService.findByUsername(username);
      if (user) {
        set.status = 400;
        return {
          message: "Username is already exists"
        }
      }
      //hash password
      const {hash, salt} = await hashPassword(password);
      const newUser = new User();
      newUser.username = username;
      newUser.password = hash;
      newUser.salt = salt;
      const created = await userService.create(newUser);
      //remove password and salt
      delete created.password;
      delete created.salt;
      return {
        message: "Register success",
        data: created
      }
    }, {
      body: t.Object({
        username: t.String(),
        password: t.String()
      }),
      response: t.Object({
        message: t.String(),
        data: t.Object({
          id: t.Number(),
          username: t.String()
        })
      }),
      detail: {
        tags: ["Auth"]
      }
    });

    app.post("/login", async ({body, set, jwt}) => {
      const {username, password} = body;
      if (!username || !password) {
        set.status = 400;
        return {
          message: "Username or password is empty"
        }
      }
      const user = await userService.findByUsername(username);
      if (!user) {
        set.status = 400;
        return {
          message: "Username is not exists"
        }
      }
      const {salt, password: hash} = user;
      const isPasswordMatch = await comparePassword(password, salt, hash);
      if (!isPasswordMatch) {
        set.status = 400;
        return {
          message: "Password incorrect"
        }
      }
      //generate token
      const accessToken = await jwt.sign({
        userId: user.id,
      });
      const refreshToken = await jwt.sign({
        userId: user.id,
      });

      return {
        message: "Login success",
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            username: user.username
          }
        }
      }

    }, {
      body: t.Object({
        username: t.String(),
        password: t.String()
      }),
      response: t.Object({
        message: t.String(),
        data: t.Object({
          accessToken: t.String(),
          refreshToken: t.String(),
          user: t.Object({
            id: t.Number(),
            username: t.String()
          })
        })
      }),
      detail: {
        tags: ["Auth"]
      }
    });

    app.get("/me", async ({set}) => {
      const user = set.user;
      return {
        message: "Fetch user success",
        data: {
          id: user.id,
          username: user.username
        }
      }
    }, {
      detail: {
        tags: ["Auth"],
        security: [
          {JwtAuth: []}
        ],
      },
      beforeHandle: isAuthenticated,
    });


    return app;


  });


}

export default auth;

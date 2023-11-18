import {Elysia, t} from "elysia";
import {UserService} from "../service";
import {hasRoles} from "../middleware/authMiddleware";
import {AppRole} from "../enum";

const userService = new UserService();
const auth = (app: any) => {
  return app.group("/auth", (app: typeof Elysia) => {
    app.post("/register", async ({body}) => {
      const {username, password} = body;
      return await userService.register(username, password);
    }, {
      body: t.Object({
        username: t.String(),
        password: t.String()
      }),
      detail: {
        tags: ["Auth"]
      }
    });

    app.post("/login", async ({body, jwt}) => {
      const {username, password} = body;
      return await userService.login(username, password, jwt);
    }, {
      body: t.Object({
        username: t.String(),
        password: t.String()
      }),
      detail: {
        tags: ["Auth"]
      }
    });

    app.get("/me", async ({request}) => {
      const user = request.user;
      return {
        id: user.id,
        username: user.username
      }
    }, {
      detail: {
        tags: ["Auth"],
        security: [
          {JwtAuth: []}
        ],
      },
      beforeHandle: hasRoles()
    });

    app.get("/admin", async ({request}) => {
      const user = request.user;
      return {
        id: user.id,
        username: user.username
      }
    }, {
      detail: {
        tags: ["Auth"],
        security: [
          {JwtAuth: []}
        ],
      },
      beforeHandle: hasRoles([AppRole.ADMIN])
    });

    return app;
  });


}

export default auth;

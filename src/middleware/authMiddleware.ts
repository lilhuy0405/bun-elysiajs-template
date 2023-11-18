import {Elysia} from "elysia";
import {UserService} from "../service";
import {AppRole} from "../enum";

const userService = new UserService();
export const hasRoles = (roles: AppRole[] = []) => {
  return async ({headers, jwt, request}) => {
    //get headers
    const {authorization} = headers;
    if (!authorization) {
      throw new Error("Authorization header not found");
    }
    //get token
    const token = authorization.split(" ")[1];
    if (!token) {
      throw new Error("Token not found");
    }
    //verify token
    const {userId} = await jwt.verify(token);

    if (!userId) {
      throw new Error("Token is invalid");
    }
    const user = await userService.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    //check role
    //skip for admin role
    if (user.role === AppRole.ADMIN) {
      request.user = user;
      return;
    }
    //check role
    if (roles.length && !roles.includes(user.role)) {
      throw new Error("User doesn't have permission");
    }
    //add user to request
    request.user = user;
  }
}

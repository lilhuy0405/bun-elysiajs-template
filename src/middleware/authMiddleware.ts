import {Elysia} from "elysia";
import {UserService} from "../service";

const userService = new UserService();
export const isAuthenticated = async ({set, headers, jwt, request}) => {
  //get headers
  const {authorization} = headers;
  if (!authorization) {
    set.status = 401;
    return {
      message: "Token not found in headers"
    }
  }
  //get token
  const token = authorization.split(" ")[1];
  if (!token) {
    set.status = 401;
    return {
      message: "Token not found in headers"
    }
  }
  //verify token
  const {userId} = await jwt.verify(token);

  if (!userId) {
    set.status = 401;
    return {
      message: "Token is invalid"
    }
  }
  const user = await userService.findById(userId);
  if (!user) {
    set.status = 401;
    return {
      message: "User not found"
    }
  }
  //add user to request
  request.user = user;



}

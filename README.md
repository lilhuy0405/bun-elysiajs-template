# Elysia with Bun runtime

## Getting Started
### 1. Install bun 1.0.3 Ubuntu
```bash
curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.3"
```

### 2. Install dependencies
```bash
bun install
```


### 3. Development

To start the development server run:

```bash
bun run dev
```

## About Bun

- Bun is just a js runtime instead of well-known nodejs runtime. It's built on top of deno runtime and it's still in
  early stage.
- You can still use nodejs runtime to run this project by using npm or yarn.
- Im using bun because it's faster than nodejs and it's support typescript out of the box.

## About Elysia

- Elysia is a web framework built on top of bun runtime. It's inspired by nestjs framework.
- But Elysia is more lightweight and faster than nestjs. Less boilerplate code and more fun.
- Compare to express or koa, Elysia is more structured and easier to maintain.

# Some important notes
### 1. Environment Note

- In this template, i use typeorm for database orm so we need bun > 1.0.3 to support typeorm
- Also Bun doesn't support window yet so you can run through docker: `docker-compose up -d --build` and
  open http://localhost:8080/ with your browser to see the result.
- This project have setup swagger, jwt auth using postgres database.
### 2. Modules Note
- Modules in Elysia is just a group of handlers (or controller so to speak)
- Add more modules in `src/modules` folder then tell Elysia to load it in `src/index.ts`  => `ctx.use(yourModule)`
- Each module have it own router and to call the  service (which contains logical code)

### 3. Authentication Note
- For routes that need authentication add `beforeHandle: hasRoles()` hook then add `    security: [
  {JwtAuth: []}],` in `detail` hook of your route. The `hasRoles()` middleware accept an array of roles that define
  in `src/enum/index.ts`allow to access the route.
- Then in handler access logged in user by `request.user`

### 4. API response Note
- All api will response to this object
```json
{
  "success": true,
  "data": {},
  "message": ""
}
```
look at `src/middleware/responseMiddleware.ts` for more detail
- So don't wrap your response value in a `data` object, just return the value you want to response.
```typescript
// bad
return {
  data: {
    name: 'LilHuy'
  }
}
// good
return {
  name: 'LilHuy'
}
```
- All error will response to this object
```json
{
  "message": "",
  "status": 500
}
```
look at `src/middleware/errorMiddleware.ts` for more detail

- Elysia will auto catch all error and response to client so you don't need to worry about it
- Don't use try catch in your handler, use `throw new Error()` instead.
```typescript
// bad
try {
  
} catch (e) {
  
}
// good
throw new Error('User not found')
/* this will response to client
{
  "message": "User not found",
  "status": 400
}
 */
```

### Happy coding!

- Created by LilHuy I will update more features in the future.

# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

# Some important notes
- In this template, i use typeorm for database orm so we need bun > 1.0.3 to support typeorm
- Also Bun doesn't support window yet so you can run through docker: `docker-compose up -d --build` and open http://localhost:3000/ with your browser to see the result.
- This project have setup swagger, jwt auth using postgres database.
- Add more modules in `src/modules` folder then tell Elysia to load it in `src/index.ts`  => `ctx.use(yourModule)`

Happy coding!
- Created by LilHuy I will update more features in the future.

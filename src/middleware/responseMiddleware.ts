const responseMiddleware = ({set, response}) => {
  set.status = 200;
  return {
    status: 200,
    message: "Success",
    data: response
  }
}
export default responseMiddleware;

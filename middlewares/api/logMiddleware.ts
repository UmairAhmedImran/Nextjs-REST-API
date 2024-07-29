export function logMiddlware(request: Request) {
  return { response: request.method + " " + request.url };
}

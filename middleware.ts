import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddlware } from "./middlewares/api/logMiddleware";

export const config = {
  matcher: "/api/:path*",
};

export default function middleware(request: Request) {
  const authResult = authMiddleware(request);

  if (request.url.includes("/api/blogs")) {
    const logResult = logMiddlware(request);
    console.log(logResult.response);
  }

  if (!authResult.isValid) {
    // && request.url.includes("/api/blogs") in if blog to include and specified the api which needs middleware
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  return NextResponse.next();
}

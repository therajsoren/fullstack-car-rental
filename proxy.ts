import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "JWT_SECRET environment variable must be set in production"
      );
    }
    return "dev-fallback-secret-change-in-production-32chars";
  }
  return secret;
};

let _jwtSecret: Uint8Array | null = null;
const getEncodedSecret = () => {
  if (!_jwtSecret) {
    _jwtSecret = new TextEncoder().encode(getJwtSecret());
  }
  return _jwtSecret;
};

const publicRoutes = [
  "/",
  "/cars",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/cars",
];

function isPublicRoute(pathname: string): boolean {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return true;
  }

  return publicRoutes.some((route) => {
    return pathname === route || pathname.startsWith(route + "/");
  });
}

async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getEncodedSecret());
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    if (!pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifyToken(token);

  if (!session) {
    if (!pathname.startsWith("/api/")) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

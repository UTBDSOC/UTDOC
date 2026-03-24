import { NextResponse } from "next/server";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export function ok<T>(data: T, meta?: PaginationMeta) {
  return NextResponse.json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function badRequest(message: string) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 400 },
  );
}

export function unauthorized(message = "Authentication required") {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 },
  );
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 },
  );
}

export function notFound(message = "Not found") {
  return NextResponse.json(
    { success: false, error: message },
    { status: 404 },
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return unauthorized();
  }
  console.error("[API Error]", error);
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 },
  );
}

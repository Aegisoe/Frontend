import { NextRequest, NextResponse } from "next/server";

const PRIMARY_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://aegisoebe-production.up.railway.app";
const FALLBACK_URL = process.env.NEXT_PUBLIC_BACKEND_URL_FALLBACK ?? "http://localhost:3000";

async function tryFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    next: { revalidate: 0 },
  });
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: res.status });
  } catch {
    // Non-JSON response — wrap raw text
    return NextResponse.json(
      { error: text || "Non-JSON response", raw: true },
      { status: res.status }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const suffix = path.join("/");

  // Try primary first, fallback if it fails
  try {
    return await tryFetch(`${PRIMARY_URL}/${suffix}`);
  } catch {
    // Primary failed, try fallback
  }

  try {
    return await tryFetch(`${FALLBACK_URL}/${suffix}`);
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const suffix = path.join("/");
  const body = await request.text();

  const init: RequestInit = { method: "POST", body };

  try {
    return await tryFetch(`${PRIMARY_URL}/${suffix}`, init);
  } catch {
    // Primary failed, try fallback
  }

  try {
    return await tryFetch(`${FALLBACK_URL}/${suffix}`, init);
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const suffix = path.join("/");

  try {
    return await tryFetch(`${PRIMARY_URL}/${suffix}`, { method: "DELETE" });
  } catch {}

  try {
    return await tryFetch(`${FALLBACK_URL}/${suffix}`, { method: "DELETE" });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const range = request.headers.get("range");
    const headers: Record<string, string> = {};
    if (range) {
      headers["Range"] = range;
    }

    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch video: ${response.statusText}`, {
        status: response.status,
      });
    }

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return new NextResponse(`Error proxying video: ${error.message}`, {
      status: 500,
    });
  }
}

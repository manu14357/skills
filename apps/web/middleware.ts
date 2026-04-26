import { NextRequest, NextResponse } from "next/server";

const redisConfigured = Boolean(process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

async function hitUpstashCounter(prefix: string, ip: string, limit: number) {
  if (!redisConfigured) {
    return { success: true, limit, remaining: limit, reset: Date.now() + 60 * 60 * 1000 };
  }

  const baseUrl = process.env.UPSTASH_REDIS_REST_URL as string;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN as string;
  const hourBucket = Math.floor(Date.now() / (60 * 60 * 1000));
  const key = `${prefix}:${ip}:${hourBucket}`;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const incrResponse = await fetch(`${baseUrl}/incr/${key}`, { headers, method: "POST" });
  const incrJson = (await incrResponse.json()) as { result: number };
  const count = Number(incrJson.result || 0);

  if (count === 1) {
    await fetch(`${baseUrl}/expire/${key}/7200`, { headers, method: "POST" });
  }

  const reset = (hourBucket + 1) * 60 * 60 * 1000;
  return {
    success: count <= limit,
    limit,
    remaining: Math.max(limit - count, 0),
    reset
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/submit") && !pathname.startsWith("/api/edit")) {
    return NextResponse.next();
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "127.0.0.1";

  const result = pathname.startsWith("/api/submit")
    ? await hitUpstashCounter("zskills:submit", ip, 3)
    : await hitUpstashCounter("zskills:edit", ip, 10);

  if (!result.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(result.remaining),
          "X-RateLimit-Reset": String(result.reset)
        }
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(result.reset));
  return response;
}

export const config = {
  matcher: ["/api/submit", "/api/edit"]
};

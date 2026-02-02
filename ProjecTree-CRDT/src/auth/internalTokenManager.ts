import axios from "axios";

const SPRING_BASE_URL = process.env.SPRING_BASE_URL!;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!;

let cachedToken: string | null = null;
let expiredAt = 0;

/**
 * JWT payload에서 exp 추출
 */
function getExpiredAt(token: string): number {
  const [, payload] = token.split(".");
  if (!payload) {
    throw new Error("Invalid JWT format");
  }

  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));

  if (typeof decoded.exp !== "number") {
    throw new Error("JWT exp claim missing");
  }

  return decoded.exp * 1000;
}

async function requestNewToken(): Promise<string> {
  const res = await axios.post(
    `${SPRING_BASE_URL}/api/auth/internal/token`,
    {},
    {
      headers: {
        "X-INTERNAL-KEY": INTERNAL_API_KEY,
      },
      timeout: 3000,
    },
  );

  const token = res.data?.data?.token;
  if (!token) {
    throw new Error("Internal token 발급 실패");
  }

  cachedToken = token;
  expiredAt = getExpiredAt(token);
  console.log(
    `[InternalTokenManager] New token acquired, expires at ${new Date(
      expiredAt,
    ).toISOString()}`,
  );
  return token;
}

export async function getInternalToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && now < expiredAt - 30_000) {
    return cachedToken;
  }

  return requestNewToken();
}

export function invalidateInternalToken() {
  cachedToken = null;
  expiredAt = 0;
}

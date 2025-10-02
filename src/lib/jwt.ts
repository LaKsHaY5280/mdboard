import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export interface AuthPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export async function signJWT(payload: AuthPayload) {
  const jwt = new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h");

  return await jwt.sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Validate that the payload contains our expected fields
    if (
      payload &&
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.firstName === "string" &&
      typeof payload.lastName === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

import jwt from "jsonwebtoken";
interface LoginToken {
  email: string;
  userID: string;
}

export function VerifyLoginToken(loginToken: string): LoginToken | null {
  const private_key: string | null =
    process.env.TOKEN_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? null;
  if (private_key == null) {
    console.error(
      "PRIVATE_KEY env variable is not defined! Cannot verify login token."
    );
    return null;
  }
  try {
    return jwt.verify(loginToken, private_key, {
      algorithms: ["RS256"],
    }) as LoginToken;
  } catch (e) {
    return null;
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../backend/db/schemas/User";
import { GetUserFromLoginToken } from "../../backend/login/GetUserFromLoginToken";

type ErrorResp = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ErrorResp>
) {
  const loginToken: string | null = req.cookies["LoginToken"] ?? null;
  const user: IUser | null = await GetUserFromLoginToken(loginToken);
  if (user == null) {
    res.status(401).json({ error: "Invalid login token" });
    return;
  }
  const mirroredURL = req.query["mirror"] ?? null;
  if (mirroredURL == null) {
    res.status(400).json({ error: "Must specify mirrored url" });
    return;
  }
  try {
    new URL(mirroredURL as string);
  } catch (e) {
    res.status(400).json({ error: "Invalid mirror url" });
    return;
  }
  const mirror = await fetch(<string>mirroredURL);
  res.status(mirror.status).send(await mirror.text());
}

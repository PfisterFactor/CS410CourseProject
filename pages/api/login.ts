import type { NextApiRequest, NextApiResponse } from "next";
import * as EmailValidator from "email-validator";
import { ConnectToDB } from "../../backend/db/Database";
import { UserModel } from "../../backend/db/schemas/User";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface ErrorResp {
  error: string;
}
interface OkResp {
  status: string;
  data: any;
}
type Response = OkResp | ErrorResp;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "POST") {
    res.status(404).json({ error: "This endpoint only accepts POST" });
    return;
  }
  const body = JSON.parse(req.body);
  const email: string = body?.["email"]?.toLowerCase() ?? null;
  const password: string = body?.["password"] ?? null;

  if (email === null || password === null) {
    res.status(400).json({ error: "Password or email was not specified." });
    return;
  }

  if (!EmailValidator.validate(email)) {
    res.status(400).json({ error: "Email is not a valid email address." });
    return;
  }

  ConnectToDB();

  const user = await UserModel.findOne({
    email: email,
  })
    .lean()
    .exec();
  if (user == null) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const hashedPassword = user.password!;
  const validated = await bcrypt.compare(password, hashedPassword);

  if (!validated) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const private_key: string | null =
    process.env.TOKEN_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? null;
  if (private_key == null) {
    console.error(
      "PRIVATE_KEY env variable is not defined! Cannot login to account!"
    );
    res.status(500).json({ error: "Misconfigured server" });
    return;
  }

  const loginToken = jwt.sign(
    {
      userID: user._id,
      email: user.email,
    },
    private_key,
    {
      expiresIn: "2 days",
      algorithm: "RS256",
    }
  );

  res.status(200).json({
    status: "OK",
    data: {
      email: email,
      loginToken: loginToken,
    },
  });
}

import * as bcrypt from "bcrypt";
import * as EmailValidator from "email-validator";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { ConnectToDB } from "../../backend/db/Database";
import { UserModel } from "../../backend/db/schemas/User";

interface ErrorResp {
  error: string;
}
interface OkResp {
  status: string;
  data: any;
}
type Response = OkResp | ErrorResp;

const BCRYPT_SALT_ROUNDS: number = 10;

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

  // BCrypt only hashes the first 72 bytes
  if (Buffer.byteLength(password, "utf-8") > 72) {
    res.status(400).json({ error: "Password is too long." });
    return;
  }
  ConnectToDB();
  const existingUser = await UserModel.exists({ email: email });
  if (existingUser != null) {
    res.status(403).json({ error: "Email is taken." });
    return;
  }
  const private_key: string | null =
    process.env.TOKEN_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? null;
  if (private_key == null) {
    console.error(
      "PRIVATE_KEY env variable is not defined! Cannot create new account!"
    );
    res.status(500).json({ error: "Misconfigured server" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const newUser: any = new UserModel({
    email: email,
    password: hashedPassword,
    scheduled: [],
  });

  const loginToken = jwt.sign(
    {
      userID: newUser._id.toString(),
      email: newUser.email,
    },
    private_key,
    {
      expiresIn: "2 days",
      algorithm: "RS256",
    }
  );

  newUser.save();

  res.status(200).json({
    status: "OK",
    data: {
      email: email,
      loginToken: loginToken,
    },
  });
}

import { Types } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { ScrapeDataModel } from "../../backend/db/schemas/ScrapeData";
import { ScrapeDetailModel } from "../../backend/db/schemas/ScrapeDetail";
import { GetUserFromLoginToken } from "../../backend/login/GetUserFromLoginToken";

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
  switch (req.method) {
    case "POST":
      return await HandlePost(req, res);
    case "DELETE":
      return await HandleDelete(req, res);
    default:
      res
        .status(404)
        .json({ error: "This endpoint only accepts POST and DELETE" });
      break;
  }
}

async function HandleDelete(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const body = JSON.parse(req.body);
  const detailID = body["detailID"] ?? null;

  if (detailID == null) {
    res.status(400).json({ error: "DetailID is null" });
    return;
  }

  const loginToken: string | null = req.cookies["LoginToken"] ?? null;
  const user: any = await GetUserFromLoginToken(loginToken);
  if (user == null) {
    res.status(401).json({ error: "Invalid login token" });
    return;
  }
  if (!user.scheduled.includes(new Types.ObjectId(detailID))) {
    res.status(401).json({ error: "Permission denied" });
    return;
  }
  const detail = await ScrapeDetailModel.findById(detailID);
  if (detail == null) {
    res.status(404).json({ error: "Detail ID does not exist" });
    return;
  }
  await ScrapeDataModel.deleteMany({
    detailID: detail._id,
  }).exec();
  user.scheduled = user.scheduled.filter(
    (d: Types.ObjectId) => !d.equals(detail._id)
  );
  await ScrapeDetailModel.deleteOne({
    _id: detail._id,
  }).exec();
  await user.save();
  res.status(200).json({ status: "OK", data: {} });
}
async function HandlePost(req: NextApiRequest, res: NextApiResponse<Response>) {
  const loginToken: string | null = req.cookies["LoginToken"] ?? null;
  const user: any = await GetUserFromLoginToken(loginToken);
  if (user == null) {
    res.status(401).json({ error: "Invalid login token" });
    return;
  }
  const body = JSON.parse(req.body);
  const scrapeDetails: IScrapeDetail = body["scrapeDetails"] ?? null;
  const detailID = body["detailID"] ?? null;

  if (detailID == null) {
    res.status(400).json({ error: "DetailID is null" });
    return;
  }
  if (scrapeDetails == null) {
    res.status(400).json({ error: "scrapeDetails is null" });
    return;
  }

  if (!user.scheduled.includes(new Types.ObjectId(detailID))) {
    res.status(401).json({ error: "Permission denied" });
    return;
  }

  const detail = await ScrapeDetailModel.findById(detailID);
  if (detail == null) {
    res.status(404).json({ error: "Detail ID does not exist" });
    return;
  }

  detail.schedule = scrapeDetails.schedule ?? detail.schedule;
  detail.CSSSelectors = scrapeDetails.CSSSelectors ?? detail.CSSSelectors;
  await detail.save();
  res.status(200).json({status: "OK", data: {}});

}

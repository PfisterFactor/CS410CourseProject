import mongoose, { Schema } from "mongoose";
import { ConnectToDB } from "../db/Database";
import { IScrapeData, ScrapeDataModel } from "../db/schemas/ScrapeData";
import { IScrapeDetail, ScrapeDetailModel } from "../db/schemas/ScrapeDetail";
import { IUser } from "../db/schemas/User";
import {Zip} from "zip-lib";
import tmp from "tmp";
import fs from "fs";
import path from "path";

export interface JSONDataExport {
    details: Partial<IScrapeDetail>[],
    data: Partial<IScrapeData>[]
}

export async function GetJSONExport(user: IUser, detailID: mongoose.Types.ObjectId | null = null): Promise<JSONDataExport> {
    let scheduled = user.scheduled;
    if (detailID != null) {
        scheduled = scheduled.filter((id: mongoose.Types.ObjectId) => id.equals(detailID));
    }
    
    await ConnectToDB();
    const detailExport = await ScrapeDetailModel.find({
        _id: {
            $in: scheduled
        }
    }).exec().then(d => d.map(x => x.toJSON()));

    const detailIDS = detailExport.map(d => d._id);
    const dataExport = await ScrapeDataModel.find({
        detailID: {
            $in: detailIDS
        }
    },{_id: 0}).exec().then(d => d.map(x => x.toJSON()));
    return {
        details: detailExport,
        data: dataExport
    }
}

export async function GetZippedJSONExport(dataExport: JSONDataExport): Promise<Buffer> {
    const zip = new Zip();
    const tempExportDir = tmp.dirSync().name;

    let scrapeDetailsFile = path.join(tempExportDir,"scraping_details.json")
    let scrapeDataFile = path.join(tempExportDir,"scraping_data.json")
    let scrapeZipFile = path.join(tempExportDir,"scrape_export.zip")
    fs.writeFile(path.join(tempExportDir,"scraping_details.json"),JSON.stringify(dataExport.details),() => {});
    fs.writeFile(path.join(tempExportDir,"scraping_data.json"),JSON.stringify(dataExport.data),() => {});
    zip.addFile(scrapeDetailsFile);
    zip.addFile(scrapeDataFile);
    await zip.archive(scrapeZipFile);
    const fileStream: Buffer = fs.readFileSync(scrapeZipFile);
    return fileStream;
}
import mongoose from "mongoose"

const ScrapeDetailSchema = new mongoose.Schema(
    {
        url: String,
        CSSSelectors: [],
        schedule: String,
        userID: String,
        lastRan: Date   
    }
);

export const ScrapeDetailModel = mongoose.models.scrapeDetail || mongoose.model("scrapeDetail", ScrapeDetailSchema, "scrapedetail");


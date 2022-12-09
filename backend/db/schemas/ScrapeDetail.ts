import mongoose, { InferSchemaType } from "mongoose"

const ScrapeDetailSchema = new mongoose.Schema(
    {
        url: String,
        CSSSelectors: [{
            name: String,
            selector: String,
            slug: String
        }],
        schedule: String,
        userID: String,
        lastRan: Date
    }
);

export type IScrapeDetail = InferSchemaType<typeof ScrapeDetailModel>
export const ScrapeDetailModel = mongoose.models.scrapeDetail || mongoose.model("scrapeDetail", ScrapeDetailSchema, "scrapedetail");


import mongoose, { InferSchemaType } from "mongoose"

const CSSSelectorSchema = new mongoose.Schema({
    name: String,
    selector: String,
    slug: String
},{"_id": false});

const ScrapeDetailSchema = new mongoose.Schema(
    {
        url: String,
        CSSSelectors: [CSSSelectorSchema],
        schedule: String,
        userID: String,
        lastRan: Date,
        scrapesRan: Number
    }
);

export type IScrapeDetail = InferSchemaType<typeof ScrapeDetailSchema>
export const ScrapeDetailModel = mongoose?.models?.ScrapeDetail || mongoose.model("ScrapeDetail", ScrapeDetailSchema, "scrapedetail");


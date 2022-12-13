import mongoose, { InferSchemaType, Schema } from "mongoose"

const CSSSelectorSchema = new mongoose.Schema({
    name: String,
    selector: String,
    slug: String
},{"_id": false});

const ScrapeDetailSchema = new mongoose.Schema(
    {
        _id: Schema.Types.ObjectId,
        url: String,
        CSSSelectors: [CSSSelectorSchema],
        schedule: String,
        lastRan: Date,
        scrapesRan: Number
    }
);

export type IScrapeDetail = InferSchemaType<typeof ScrapeDetailSchema>
const cachedModel = mongoose?.models?.ScrapeDetail as mongoose.Model<IScrapeDetail,{},{},{},typeof ScrapeDetailSchema>;
export const ScrapeDetailModel = cachedModel || mongoose.model("ScrapeDetail", ScrapeDetailSchema, "scrapedetail");


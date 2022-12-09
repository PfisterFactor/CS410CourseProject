import mongoose, { InferSchemaType, Schema } from "mongoose"

const ScrapeDataSchema = new mongoose.Schema(
    {
        _id: Schema.Types.ObjectId,
        data: [{}],
        detailID: Schema.Types.ObjectId,
        time: Date
    }
);

export type IScrapeData = InferSchemaType<typeof ScrapeDataSchema>
export const ScrapeDataModel = mongoose?.models?.ScrapeData || mongoose.model("ScrapeData", ScrapeDataSchema, "scrapedata");


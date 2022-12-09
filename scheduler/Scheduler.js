const cron = require("node-cron");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const later = require("@breejs/later");
const dotenv = require("dotenv");

const CSSSelectorSchema = new mongoose.Schema({
    name: String,
    selector: String,
    slug: String
}, { "_id": false });

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
const ScrapeDetailModel = mongoose.model("ScrapeDetail", ScrapeDetailSchema, "scrapedetail");

const ScrapeDataSchema = new mongoose.Schema(
    {
        data: [{}],
        detailID: mongoose.Schema.Types.ObjectId,
        time: Date
    }
);

const ScrapeDataModel = mongoose?.models?.ScrapeDataSchema || mongoose.model("ScrapeData", ScrapeDataSchema, "scrapedata");

async function ConnectToDB() {
    mongoose.set('strictQuery', true);
    const mongoURI = process.env.MONGODB_URL ?? null;
    if (mongoURI == null) {
        throw new Error("MONGODB_URL not specified in .env.local! Please specify a connection string before connecting.");
    }
    await mongoose.connect(mongoURI);
}

dotenv.config();
Startup();

async function Startup() {
    await ScrapeWorker(new Date());
    const worker = cron.schedule("* * * * *",async (now) => {
        await ScrapeWorker(now);
    });
    worker.start();
}

async function ScrapeWorker(now) {
    console.log("Starting scrape worker!");
    ConnectToDB();
    const scrapeDetails = await ScrapeDetailModel.find({}).exec();
    let scrapingTasksToRun = [];
    for (const scrapeDetail of scrapeDetails) {
        const parsed = later.parse.cron(scrapeDetail.schedule);
        const nextRun = later.schedule(parsed).next(1,scrapeDetail.lastRan);
        if (nextRun <= now) {
            scrapingTasksToRun.push(scrapeDetail);
        }
    }

    for (const scrapeDetail of scrapingTasksToRun) {
        console.log(`Running scraping task on '${scrapeDetail.url}' for ID: '${scrapeDetail._id}'`);
        const scraped = await ScrapePage(scrapeDetail);
        UploadScrapedDataToDB(scrapeDetail,scraped, now);
        console.log(`Finished scraping task for ID: '${scrapeDetail._id}`);
    }
}
async function ScrapePage(scrapeDetail) {
    const url = scrapeDetail.url;
    const selectors = scrapeDetail.CSSSelectors;
    const collectedData = [];
    try {
        const site = await axios.get(url);
        const html = site.data;
        const $ = cheerio.load(html);
        for (const selectorInfo of selectors) {
            const selector = selectorInfo.selector;
            const data = $(selector).text();
            collectedData.push({
                [selectorInfo.slug]: data
            });
        }
    }
    catch(e) {
        console.warn(`Error scraping page '${url}' for scrape detail job '${scrapeDetail._id}': ${e}`);
    }
    return collectedData;
    
}
async function UploadScrapedDataToDB(detail, data, now) {
    if (data == []) return;
    const scrapeData = new ScrapeDataModel({
        data: data,
        detailID: detail._id,
        time: now
    });
    scrapeData.save();
    detail.lastRan = now;
    detail.scrapesRan += 1;
    detail.save();
}



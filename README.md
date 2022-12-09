# Visual Web Scraper Project Proposal

## Project Members
- Eric Pfister (epfist2) | Team Captain
- James Coombes (coombes3)
- Khyle Calimlim (khylejc2)

## Proposal

We are going to build an Electron based application that would allow users to scrape websites visually. We provide an interface that allows users to input a website and it would show them the page. Then it would allow them to select the DOM elements that they want to have automatically scraped from that page. We then have the application generate the neccesary CSS selectors and ask the user how often they want the data scraped.

Web scraping is a common task among data scientists and we hope to make the process more approachable for someone without a background in coding.

Then, on a schedule the application will scrape that data from the website and forward it to the user through multiple options: store to a database, send an email, or write to a file.

## Steps to Take
We plan to:
- Develop an interface that allows users to select what websites they want scraped (10 hours)
- Implement scraping engine (5 hours)
- Create data exports to email, database, and files (5 hours)
- Develop a scheduling system that runs in the background and automatically scrapes the data on a set schedule (5 hours)
- Allow a user to visually select which elements from a web page they want scraped (20 hours)
- Organize and display the scraped data and its history in an intuitive way (20 hours)
- Allow the user to specify data transformers (to JSON, to CSV, etc.) (5 hours)

## Technologies
We plan to use Typescript, Electron and Node.js with a user interface built with React. We are going to leverage the popular web scraping library [Puppeteer](https://pptr.dev/) for our scraping. 

# Installation
- Install node.js and npm
- Clone the repo
- Run "npm install" within the base directory
- Run "cd scheduler" and then "npm install" within the scheduler subdirectory
- Start the scheduler by running "npm run start" in the subdirectory
- In another terminal, go to the root of the repo
- Run "npm run dev" to run a development build
- Navigate to https://localhost:3000/

/* eslint-disable @typescript-eslint/no-require-imports */
const xml2js = require("xml2js");
const https = require("https");

// Configuration
const sitemapUrl = "https://www.liturgianews.site/sitemap.xml";
const host = "https://www.liturgianews.site";
const key = "79d0fb46689e4d22aed910329daa7293";
const keyLocation =
  "https://www.liturgianews.site/79d0fb46689e4d22aed910329daa7293.txt";

const modifiedSinceDate = new Date(process.argv[2] || "1970-01-01");

if (isNaN(modifiedSinceDate.getTime())) {
  console.error("Invalid date provided. Please use format YYYY-MM-DD");
  process.exit(1);
}

function fetchSitemap(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function parseSitemap(xmlData) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function filterUrlsByDate(sitemap, date) {
  const urls = sitemap.urlset.url;
  return urls
    .filter((url) => new Date(url.lastmod[0]) > date)
    .map((url) => url.loc[0]);
}

function postToIndexNow(urlList) {
  const data = JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
  });

  const options = {
    hostname: "api.indexnow.org",
    port: 443,
    path: "/IndexNow",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": data.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => {
        responseData += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          data: responseData,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  try {
    const xmlData = await fetchSitemap(sitemapUrl);
    const sitemap = await parseSitemap(xmlData);
    const filteredUrls = filterUrlsByDate(sitemap, modifiedSinceDate);
    console.log(filteredUrls);

    if (filteredUrls.length > 0) {
      const response = await postToIndexNow(filteredUrls);
      console.log("IndexNow API Response:");
      console.log("Status:", response.statusCode, response.statusMessage);
      console.log("Data:", response.data);
    } else {
      console.log("No URLs modified since the specified date.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
// EXECUTE WITH: node indexnow.js 2025-07-11

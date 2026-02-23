/* eslint-disable no-undef */
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");

const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/wallet", changefreq: "weekly", priority: 0.8 },
  { url: "/deposit", changefreq: "weekly", priority: 0.8 },
  { url: "/statistics", changefreq: "weekly", priority: 0.8 },
  { url: "/profile", changefreq: "weekly", priority: 0.8 },
];

const sitemap = new SitemapStream({ hostname: "https://skibag.app" });
const writeStream = fs.createWriteStream(
  path.resolve(__dirname, "public", "sitemap.xml"),
);

streamToPromise(Readable.from(links).pipe(sitemap)).then((data) => {
  fs.writeFileSync(
    path.resolve(__dirname, "public", "sitemap.xml"),
    data.toString(),
  );
  console.log("Sitemap generated!");
});

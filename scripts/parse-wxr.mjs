/**
 * parse-wxr.mjs
 * Script صغير يحول WXR (تصدير WordPress) إلى JSON.
 * الاستخدام:
 *   node scripts/parse-wxr.mjs data/schs-export.xml data/content.fromxml.json
 *
 * ملاحظة:
 * هذا السكربت بسيط ومخصص لمشروعك، وليس "محوّل WordPress عام".
 */
import fs from "fs";
import { XMLParser } from "fast-xml-parser";

// نستخدم fast-xml-parser بدون dependencies ثقيلة.
// إذا بدك تستخدم السكربت فعليًا: ثبّت الحزمة:
//   npm i -D fast-xml-parser
// (الـMVP الحالي لا يحتاجها لأنه يستخدم data/content.json جاهز)

const [,, input, output] = process.argv;
if (!input || !output) {
  console.error("Usage: node scripts/parse-wxr.mjs <input.xml> <output.json>");
  process.exit(1);
}

const xml = fs.readFileSync(input, "utf8");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});
const doc = parser.parse(xml);

const channel = doc?.rss?.channel;
const items = Array.isArray(channel?.item) ? channel.item : [];

const pages = items
  .filter((it) => it["wp:post_type"] === "page" && it["wp:status"] === "publish")
  .map((it) => ({
    title: it.title,
    slug: decodeURIComponent(it["wp:post_name"] || ""),
    link: it.link,
    content: it["content:encoded"] || "",
  }));

fs.writeFileSync(output, JSON.stringify({ pages }, null, 2), "utf8");
console.log(`Written: ${output}`);

import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

const slugOf = (post) => post.slug ?? post.id.replace(/\.(md|mdx)$/i, "");
const getPubDate = (data) => data.pubDate ?? data.date;

export async function GET(context) {
  const base = import.meta.env.BASE_URL;
  const posts = (await getCollection("blog")).filter((post) => !post.data.draft);

  posts.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => {
      const slug = slugOf(post);
      const rel = `${base}blog/${slug}/`;
      return {
        ...post.data,
        pubDate: getPubDate(post.data),
        description: post.data.description ?? post.data.excerpt ?? "",
        link: new URL(rel, context.site).toString(),
      };
    }),
  });
}

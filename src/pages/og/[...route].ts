import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import { SITE_DESCRIPTION, SITE_TITLE } from "../../consts";

export const prerender = true;

const slugOf = (post: { slug?: string; id: string }) =>
  post.slug ?? post.id.replace(/\.(md|mdx)$/i, "");

const placeholderPath = "./src/assets/blog-placeholder-1.jpg";

const resolveCoverPath = (cover?: string) => {
  if (!cover) return null;
  if (cover.startsWith("/")) return `./public${cover}`;
  if (cover.startsWith("http")) return null;
  return `./public/${cover.replace(/^\/+/, "")}`;
};

const buildPages = async () => {
  const posts = (await getCollection("blog")).filter((post) => !post.data.draft);
  const blogEntries = Object.fromEntries(
    posts.map((post) => {
      const slug = slugOf(post);
      const key = `blog/${slug}`;
      return [
        key,
        {
          title: post.data.title ?? SITE_TITLE,
          description: post.data.description ?? post.data.excerpt ?? SITE_DESCRIPTION,
          coverPath: resolveCoverPath(post.data.cover),
        },
      ];
    }),
  );

  const staticEntries: Record<
    string,
    { title: string; description: string; coverPath?: string | null }
  > = {
    home: { title: SITE_TITLE, description: SITE_DESCRIPTION },
    blog: { title: `${SITE_TITLE} - Blog`, description: SITE_DESCRIPTION },
    "chi-siamo": { title: `${SITE_TITLE} - Chi siamo`, description: SITE_DESCRIPTION },
    metodo: { title: `${SITE_TITLE} - Metodo`, description: SITE_DESCRIPTION },
    servizi: { title: `${SITE_TITLE} - Servizi`, description: SITE_DESCRIPTION },
    "servizi/consulenza": { title: `${SITE_TITLE} - Consulenza`, description: SITE_DESCRIPTION },
    "servizi/famiglia": { title: `${SITE_TITLE} - Famiglia`, description: SITE_DESCRIPTION },
    "servizi/scuole": { title: `${SITE_TITLE} - Scuole`, description: SITE_DESCRIPTION },
    "servizi/territori": { title: `${SITE_TITLE} - Territori`, description: SITE_DESCRIPTION },
    prodotti: { title: `${SITE_TITLE} - Prodotti`, description: SITE_DESCRIPTION },
    reti: { title: `${SITE_TITLE} - Reti`, description: SITE_DESCRIPTION },
    contatti: { title: `${SITE_TITLE} - Contatti`, description: SITE_DESCRIPTION },
    "contatti-grazie": { title: `${SITE_TITLE} - Grazie`, description: SITE_DESCRIPTION },
    "contatti-errore": { title: `${SITE_TITLE} - Errore`, description: SITE_DESCRIPTION },
    "privacy-policy": { title: `${SITE_TITLE} - Privacy`, description: SITE_DESCRIPTION },
    "cookie-policy": { title: `${SITE_TITLE} - Cookie`, description: SITE_DESCRIPTION },
    "note-legali": { title: `${SITE_TITLE} - Note legali`, description: SITE_DESCRIPTION },
    about: { title: `${SITE_TITLE} - About`, description: SITE_DESCRIPTION },
  };

  return { ...staticEntries, ...blogEntries };
};

const pages = await buildPages();

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => {
    const hasCover = Boolean(page.coverPath);
    return {
      title: "",
      description: "",
      fonts: [
        "./public/fonts/Quicksand-Regular.ttf",
        "./public/fonts/Quicksand-Bold.ttf",
      ],
      bgImage: {
        path: page.coverPath ?? placeholderPath,
        fit: "cover",
        position: "center",
      },
      padding: hasCover ? 88 : 72,
      bgGradient: [
        [237, 234, 250],
        [173, 186, 235],
        [105, 125, 199],
      ],
      border: hasCover
        ? {
            color: [255, 255, 255],
            width: 6,
            side: "block-start",
          }
        : {
            color: [52, 65, 107],
            width: 0,
            side: "block-end",
          },
          /*
      logo: hasCover
        ? {
            path: "./public/images/logo/LF_logo-mark.png",
            size: [200],
          }
        : undefined,
        */
      font: {
        title: {
          color: [255, 255, 255],
          size: 55,
          lineHeight: 1.05,
          weight: "Bold",
          families: ["Quicksand"],
        },
        description: {
          color: [255, 255, 255],
          size: 30,
          lineHeight: 1.3,
          weight: "Regular",
          families: ["Quicksand"],
        },
      },
    };
  },
});

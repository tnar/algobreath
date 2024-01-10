import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getNotes } from "~/models/notes.server";
import { getTags } from "~/models/tags.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const urls: string[] = [];
  urls.push("https://www.algobreath.com");

  // Add all notes
  const notes = await getNotes(context);
  notes.forEach((note) => {
    urls.push(`https://www.algobreath.com/notes/${note.slug}`);
  });

  // Add all tags
  const tags = await getTags(context);
  tags.forEach((tag) => {
    urls.push(`https://www.algobreath.com/notes?tag=${tag.slug}`);
  });

  let content =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  urls.forEach((url) => {
    content += `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
    `;
  });
  content += "</urlset>";

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "xml-version": "1.0",
    },
  });
};

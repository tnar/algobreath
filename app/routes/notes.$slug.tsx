import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js/lib/common";
import invariant from "tiny-invariant";
import { getNote } from "~/models/note.server";
import styles from "highlight.js/styles/github-dark-dimmed.min.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");
  const note = await getNote(context, params.slug);
  invariant(note, `Note not found: ${params.slug}`);

  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  const html = marked.parse(note.markdown);
  return json({ title: note.title, html });
};

export default function NotesSlug() {
  const { title, html } = useLoaderData<typeof loader>();
  return (
    <div className="prose prose-code:whitespace-pre-wrap prose-code:break-words">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

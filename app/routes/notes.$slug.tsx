import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getNote } from "~/models/notes.server";
import marked from "~/utils/marked";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");
  const note = await getNote(context, params.slug);
  invariant(note, `Note not found: ${params.slug}`);
  invariant(note.markdown, `Note markdown not found: ${params.slug}`);
  const html = marked.parse(note.markdown);

  return json({ title: note.title, html });
};

export default function NotesSlug() {
  const { title, html } = useLoaderData<typeof loader>();

  return (
    <div className="prose prose-code:whitespace-pre-wrap prose-code:break-words pt-10 px-4 sm:px-0">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

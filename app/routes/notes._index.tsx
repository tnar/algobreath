import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getLatestNote } from "~/models/notes.server";
import marked from "~/utils/marked";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const note = await getLatestNote(context);
  invariant(note, "Note not found");
  invariant(note.markdown, "Note markdown not found");
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

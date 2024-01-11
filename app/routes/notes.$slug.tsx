import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getNote } from "~/models/notes.server";
import marked from "~/utils/marked";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `${data?.title} - AlgoBreath`;
  const description = "";

  return [
    { title },
    { name: "og:title", content: title },
    { name: "twitter:title", content: title },
    { name: "description", content: description },
    { name: "og:description", content: description },
    { name: "twitter:description", content: description },
  ];
};

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
    <div className="prose max-w-none prose-headings:max-w-prose prose-p:max-w-prose prose-ol:max-w-prose prose-ul:max-w-prose prose-li::max-w-prose prose-pre:p-0 pt-8 px-4 sm:px-8 mx-auto">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

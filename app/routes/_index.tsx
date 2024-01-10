import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getNotes, getNote } from "~/models/notes.server";
import invariant from "tiny-invariant";
import marked from "~/utils/marked";
import { getTags } from "~/models/tags.server";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const tags = await getTags(context);
  invariant(tags, "Tags not found");
  const notes = await getNotes(context);
  invariant(notes, "Notes not found");
  const note = await getNote(context, notes[0].slug);
  invariant(note, `Note not found: ${params.slug}`);
  invariant(note.markdown, `Note markdown not found: ${params.slug}`);
  const html = marked.parse(note.markdown);

  return json({ tags, notes, html });
};

export const meta: MetaFunction = () => {
  const title = "AlgoBreath";
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

export default function Index() {
  const { tags, notes, html } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-wrap sm:flex-row min-h-screen">
      <div className="hidden sm:block px-3 py-4 overflow-y-auto">
        <ul className="menu bg-base-200 w-56 p-0 [&_li>*]:rounded-none">
          <li className="menu-title">Tags</li>
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link to={`notes?tag=${tag.slug}`}>{tag.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden sm:block px-3 py-4 overflow-y-auto">
        <ul className="menu bg-base-200 w-56 p-0 [&_li>*]:rounded-none">
          <li className="menu-title">Notes</li>
          {notes.map((note) => (
            <li key={note.slug}>
              <Link to={`notes/${note.slug}`}>{note.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="prose prose-code:whitespace-pre-wrap prose-code:break-words pt-8 px-4 sm:px-0">
          <h1>{notes[0].title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}

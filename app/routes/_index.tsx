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
      <div className="hidden xl:block mx-3 my-4 overflow-y-auto h-screen">
        <ul className="menu bg-base-200 w-36 p-0 [&_li>*]:rounded-none">
          <li className="menu-title">Tags</li>
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link to={`notes?tag=${tag.slug}`}>{tag.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden xl:block mx-3 my-4 overflow-y-auto h-screen">
        <ul className="menu bg-base-200 w-56 p-0 [&_li>*]:rounded-none">
          <li className="menu-title">Notes</li>
          {notes.map((note) => (
            <li key={note.slug}>
              <Link to={`notes/${note.slug}`}>{note.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="prose max-w-none prose-headings:max-w-prose prose-p:max-w-prose prose-ol:max-w-prose prose-ul:max-w-prose prose-li::max-w-prose prose-pre:p-0 pt-8 px-4 sm:px-8 mx-auto">
          <h1>{notes[0].title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }} />
          <p className="flex flex-wrap justify-between my-10">
            <div className="btn btn-sm md:btn-md gap-2 lg:gap-3 invisible">
              {/* Placeholder */}
            </div>
            <Link
              to={`/notes/${notes[1].slug}`}
              className="btn btn-sm md:btn-md gap-2 lg:gap-3 max-w-full"
            >
              <div className="flex flex-col items-end">
                <span className="text-neutral-content/50 hidden text-xs font-normal md:block">
                  Next
                </span>{" "}
                <span>{notes[1].title}</span>
              </div>{" "}
              <svg
                className="h-6 w-6 fill-current md:h-8 md:w-8"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

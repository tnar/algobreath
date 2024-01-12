import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
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

  return json({ title: note.title, html, slug: note.slug });
};

export default function NotesSlug() {
  const { title, html, slug } = useLoaderData<typeof loader>();
  const { notes, tagSlug }: { notes: NoteSlugAndTitle[]; tagSlug: string } =
    useOutletContext();
  const currentNoteIndex = notes.findIndex((note) => note.slug === slug);
  const prevNote = notes[currentNoteIndex - 1];
  const nextNote = notes[currentNoteIndex + 1];

  return (
    <div className="prose max-w-none prose-headings:max-w-prose prose-p:max-w-prose prose-ol:max-w-prose prose-ul:max-w-prose prose-li::max-w-prose prose-pre:p-0 pt-8 px-4 sm:px-8 mx-auto">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <p className="flex flex-wrap justify-between my-10">
        {prevNote ? (
          <Link
            to={
              tagSlug
                ? `/notes/${prevNote.slug}?tag=${tagSlug}`
                : `/notes/${prevNote.slug}`
            }
            className="btn btn-sm md:btn-md gap-2 lg:gap-3 mb-5"
          >
            <svg
              className="h-6 w-6 fill-current md:h-8 md:w-8"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
            </svg>
            <span>Prev</span>
          </Link>
        ) : (
          <div className="btn btn-sm md:btn-md gap-2 lg:gap-3 invisible">
            {/* Placeholder */}
          </div>
        )}
        {nextNote && (
          <Link
            to={
              tagSlug
                ? `/notes/${nextNote.slug}?tag=${tagSlug}`
                : `/notes/${nextNote.slug}`
            }
            className="btn btn-sm md:btn-md gap-2 lg:gap-3"
          >
            <span className="">Next</span>
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
        )}
      </p>
    </div>
  );
}

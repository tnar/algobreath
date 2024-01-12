import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getNotes, getNotesFromTag } from "~/models/notes.server";
import invariant from "tiny-invariant";
import { getTags } from "~/models/tags.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.tagTitle
    ? `${data?.tagTitle} - AlgoBreath`
    : `Recent Notes - AlgoBreath`;
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

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const tags = await getTags(context);
  invariant(tags, "Tags not found");

  const { searchParams } = new URL(request.url);
  const tagSlug = searchParams.get("tag");
  let notes;
  let tagTitle;
  if (tagSlug) {
    const tagId: number | undefined = tags.find((t) => t.slug === tagSlug)?.id;
    if (tagId) {
      notes = await getNotesFromTag(context, tagId);
      tagTitle = tags.find((t) => t.slug === tagSlug)?.title;
    } else {
      return redirect("/notes");
    }
  } else {
    notes = await getNotes(context);
  }

  return json({ tags, notes, tagSlug, tagTitle });
};

export default function Index() {
  const { tags, notes, tagSlug } = useLoaderData<typeof loader>();

  const filteredNotes = notes.map((note) => {
    let title = note.title;
    if (tagSlug === "typescript") {
      title = title.replace(" in TypeScript", "");
    } else if (tagSlug === "python") {
      title = title.replace(" in Python", "");
    } else if (tagSlug === "rust") {
      title = title.replace(" in Rust", "");
    }
    return { ...note, title };
  });

  return (
    <div className="flex flex-row min-h-screen">
      <div className="hidden xl:block mx-3 my-4 overflow-y-auto h-screen">
        <ul className="menu bg-base-200 w-36 p-0 [&_li>*]:rounded-none">
          <li className="menu-title">Tags</li>
          <li>
            <Link to={`/notes`} className={tagSlug === null ? "active" : ""}>
              Recent
            </Link>
          </li>
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link
                to={`?tag=${tag.slug}`}
                className={tagSlug === tag.slug ? "active" : ""}
              >
                {tag.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden xl:block mx-3 my-4 overflow-y-auto h-screen">
        <ul className="menu bg-base-200 w-56 p-0 [&_li>*]:rounded-none">
          <li className="menu-title">Notes</li>
          {filteredNotes.map((note) => (
            <li key={note.slug}>
              <NavLink
                to={tagSlug ? `${note.slug}?tag=${tagSlug}` : note.slug}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {note.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 overflow-x-auto">
        <Outlet context={{ notes }} />
      </div>
    </div>
  );
}

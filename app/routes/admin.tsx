import { json, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getNotes, getNotesFromTag } from "~/models/notes.server";
import { getTags } from "~/models/tags.server";
import invariant from "tiny-invariant";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const tags = await getTags(context);
  invariant(tags, "Tags not found");

  const { searchParams } = new URL(request.url);
  const tagSlug = searchParams.get("tag");
  let notes;
  if (tagSlug) {
    const tagId: number | undefined = tags.find((t) => t.slug === tagSlug)?.id;
    if (tagId) {
      notes = await getNotesFromTag(context, tagId);
    } else {
      return redirect("/admin");
    }
  } else {
    notes = await getNotes(context);
  }

  return json({ tags, notes, tagSlug });
};

export default function Admin() {
  const { notes, tags, tagSlug } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-wrap sm:flex-row min-h-screen">
      <div className="hidden sm:block mx-3 my-4 overflow-y-auto h-screen">
        <ul className="menu bg-base-200 w-36 p-0 [&_li>*]:rounded-none">
          <li>
            <Link to={"newTag"}>New Tag</Link>
          </li>
          <li className="menu-title">Tags</li>
          <li>
            <Link to={""}>Recent</Link>
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
          <div className="divider"></div>
          <li className="menu-title">Edit Tags</li>
          {tags.map((tag) => (
            <li key={tag.slug}>
              <NavLink
                to={`tags/${tag.slug}`}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {tag.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden sm:block mx-3 my-4 overflow-y-auto h-screen">
        <ul className="menu bg-base-200 w-56 p-0 [&_li>*]:rounded-none">
          <li>
            <Link to={"newNote"}>New Note</Link>
          </li>
          <li className="menu-title">Notes</li>
          {notes.map((note) => (
            <li key={note.slug}>
              <NavLink
                to={
                  tagSlug
                    ? `notes/${note.slug}?tag=${tagSlug}`
                    : `notes/${note.slug}`
                }
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {note.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 overflow-x-auto">
        <Outlet context={{ tags }} />
      </div>
    </div>
  );
}

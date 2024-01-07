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
      return redirect("/notes");
    }
  } else {
    notes = await getNotes(context);
  }

  return json({ tags, notes, tagSlug });
};

export const meta: MetaFunction = () => [
  { title: "New Remix App" },
  { name: "description", content: "Welcome to Remix!" },
];

export default function Index() {
  const { tags, notes, tagSlug } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-wrap sm:flex-row min-h-screen">
      <div className="hidden sm:block px-3 py-4 overflow-y-auto">
        <ul className="menu bg-base-200 w-56 p-0 [&_li>*]:rounded-none">
          <li className="menu-title">Tags</li>
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

      <div className="hidden sm:block px-3 py-4 overflow-y-auto">
        <ul className="menu bg-base-200 w-56 p-0 [&_li>*]:rounded-none">
          <li className="menu-title">Notes</li>
          {notes.map((note) => (
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

      <div className="flex-1 flex justify-center">
        <Outlet />
      </div>
    </div>
  );
}

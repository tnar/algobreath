import {
  Link,
  NavLink,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react";

export default function Index() {
  const location = useLocation();

  const getRoute = () => {
    if (location.pathname.startsWith("/notes")) {
      return "routes/notes";
    } else if (location.pathname.startsWith("/admin")) {
      return "routes/admin";
    } else {
      return "routes/_index";
    }
  };

  const { tags, notes, tagSlug } = useRouteLoaderData(getRoute()) as {
    tags: Tag[];
    notes: NoteSlugAndTitle[];
    tagSlug: string | null | undefined;
  };

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
    <>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar bg-base-300">
            <div className="flex-none xl:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2">
              <Link className="btn btn-ghost text-xl" to="/">
                <h1>AlgoBreath</h1>
              </Link>
            </div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal"></ul>
            </div>
          </div>
        </div>
        <div className="drawer-side z-[1]">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 z-[1]">
            {/* Sidebar content here */}
            <li className="menu-title">Tags</li>
            <li>
              <Link to={`/notes`} className={tagSlug === null ? "active" : ""}>
                Recent
              </Link>
            </li>
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  to={`/notes?tag=${tag.slug}`}
                  className={tagSlug === tag.slug ? "active" : ""}
                >
                  {tag.title}
                </Link>
              </li>
            ))}
            <div className="divider"></div>
            <li className="menu-title">Notes</li>
            {filteredNotes.map((note) => (
              <li key={note.slug}>
                <NavLink
                  to={
                    tagSlug
                      ? `/notes/${note.slug}?tag=${tagSlug}`
                      : `/notes/${note.slug}`
                  }
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {note.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

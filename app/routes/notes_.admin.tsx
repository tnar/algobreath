import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { getNotes } from "~/models/note.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return json({ notes: await getNotes(context) });
};

export default function NotesAdmin() {
  const { notes } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("new");
  }, [navigate]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        {/* Page content here */}
        <Outlet />
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <Link to="new" className="link">
              Create a New Note
            </Link>
          </li>
          {notes.map((note) => (
            <li key={note.slug}>
              <Link to={note.slug}>{note.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

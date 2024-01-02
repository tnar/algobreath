import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="navbar bg-base-300">
      <Link className="btn btn-ghost text-xl" to="/">
        AlgoBreath
      </Link>
    </div>
  );
}

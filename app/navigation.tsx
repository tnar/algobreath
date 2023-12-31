import { Form, Link, useLocation } from "@remix-run/react";

export default function Index() {
  const location = useLocation();

  return (
    <div className="navbar bg-base-100">
      <Link className="btn btn-ghost text-xl" to="/">
        AlgoBreath
      </Link>
    </div>
  );
}

import { Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="prose">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

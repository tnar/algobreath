import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <>
      <footer className="footer bg-base-200 p-10 text-base-content">
        <nav>
          <header className="footer-title">Other sites</header>
          <a
            href="https://www.breakingprompt.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Breaking Prompt
          </a>
          <a
            href="https://www.editdit.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Editdit
          </a>
          <a
            href="https://www.jemoticons.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jemoticons
          </a>
          <a
            href="https://www.emojiengine.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Emoji Engine
          </a>
          <a
            href="https://www.symbolsofit.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Symbols of it
          </a>
          <a
            href="https://www.emojiandsymbols.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Emoji & Symbols
          </a>
        </nav>
        <nav>
          <header className="footer-title">Legal</header>
          <Link to={"/terms"}>Terms of use</Link>
          <Link to={"/privacy"}>Privacy policy</Link>
        </nav>
        <nav>
          <header className="footer-title">Social</header>
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://twitter.com/tomtnar"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/tsutonaru"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-13 19h-3v-10h3v10zm-1.5-11.75c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.75h-3v-5.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5v5.5h-3v-10h3v1.5c.608-.888 1.79-1.5 3-1.5 2.485 0 4.5 2.015 4.5 4.5v5.5z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
      <footer className="footer footer-center bg-base-200 pb-24 text-base-content">
        <aside>
          <p>© 2024 Tsutomu Narushima</p>
        </aside>
      </footer>
    </>
  );
}

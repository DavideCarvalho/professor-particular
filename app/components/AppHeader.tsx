import { ReactElement } from 'react';

function AppHeader(): ReactElement {
  return (
    <nav className="w-full py-3">
      <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
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
          />
        </svg>
      </label>
    </nav>
  );
}

export default AppHeader;

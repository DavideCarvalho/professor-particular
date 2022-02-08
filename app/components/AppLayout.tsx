import { FC, PropsWithChildren, ReactElement } from 'react';
import { Form, Link, useTransition } from 'remix';
import type { User } from '@supabase/supabase-js';
import AppHeader from './AppHeader';

type AppLayoutProps = {
  user?: User;
};

export const AppLayout: FC<AppLayoutProps> = ({
  user,
  children,
}) => {
  const transition = useTransition();
  return (
    <div className="drawer min-h-screen min-w-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="header">
          <AppHeader user={user} />
        </div>
        <div className="container mx-auto">{children}</div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay" />
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          <li>
            <Link to="/salas">Salas</Link>
          </li>
          <li>
            <a>
              <Form method="post" action="/signout">
                <button
                  type="submit"
                  disabled={transition.state === 'submitting'}
                >
                  Sair
                </button>
              </Form>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

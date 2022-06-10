import { PropsWithChildren, ReactElement } from 'react';
import { Form, Link, useTransition } from 'remix';
import AppHeader from './AppHeader';
import { UserEntity } from '~/back/service/user.service';

type AppLayoutProps = {
  user?: UserEntity;
};

export function AppLayout({
  user,
  children,
}: PropsWithChildren<AppLayoutProps>): ReactElement {
  const transition = useTransition();
  return (
    <div className="drawer min-h-screen min-w-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="header">
          <AppHeader />
        </div>
        <div className="container mx-auto">{children}</div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay" />
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          <li>
            <Link to="/salas">Salas</Link>
          </li>
          {user?.stripe_id && (
            <li>
              <Link to="/portal-do-usuario">Portal de pagamento</Link>
            </li>
          )}
          <li>
            <Link to="/#preco">Planos</Link>
          </li>
          <li>
            <Form method="post" action="/signout">
              <button
                className="w-full text-left"
                type="submit"
                disabled={transition.state === 'submitting'}
              >
                Sair
              </button>
            </Form>
          </li>
        </ul>
      </div>
    </div>
  );
}

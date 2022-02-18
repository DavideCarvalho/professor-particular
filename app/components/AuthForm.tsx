import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { Form, useSearchParams, useTransition } from 'remix';

export type AuthCreds = {
  email?: string;
  password?: string;
};

type AuthFormProps = {
  isSignIn?: boolean;
  errors?: AuthCreds & { service?: Array<string> };
};

function AuthForm({
  isSignIn: isSignInProp = true,
  errors = {},
}: PropsWithChildren<AuthFormProps>): ReactElement {
  const [searchParams] = useSearchParams();
  const [redirectTo, setRedirectTo] = useState<string>('/salas');
  const [authUrl, setAuthUrl] = useState<string>('');

  useEffect(() => {
    setRedirectTo(searchParams.get('redirect_to') ?? '/salas');
  }, [searchParams, setRedirectTo]);

  useEffect(() => {
    const redirectToQueryString = searchParams.get('redirect_to')
      ? `?redirect_to=${redirectTo}`
      : '';
    isSignInProp
      ? setAuthUrl(`/cadastrar${redirectToQueryString}`)
      : setAuthUrl(`/login${redirectToQueryString}`);
  }, [isSignInProp, setAuthUrl, redirectTo]);
  let transition = useTransition();

  return (
    <Form
      className="w-full bg-gray-50 px-10 py-8 rounded-md shadow-md"
      method="post"
    >
      <fieldset>
        <legend className="text-purple-600 pb-4 text-4xl border-b mb-4">
          {isSignInProp ? `Olá professor, entre!` : `Cadastro de professor`}
        </legend>
        <div className="h-3 text-xs">
          {errors?.service && errors.service.map((error) => error)}
        </div>
        <br />
        {!isSignInProp && (
          <div className="w-full mb-6">
            <label
              className="block uppercase font-semibold text-gray-600 text-base"
              htmlFor="name"
            >
              Nome
            </label>
            <input
              id="name"
              className="w-full font-normal border py-2 px-4 text-gray-700 hover:bg-gray-50 focus:border-indigo-500 rounded-md focus:outline-none"
              name="name"
              type="text"
              required
              placeholder="Nome"
            />
          </div>
        )}
        <div className="w-full mb-6">
          <label
            className="block uppercase font-semibold text-gray-600 text-base"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            className="w-full font-normal border py-2 px-4 text-gray-700 hover:bg-gray-50 focus:border-indigo-500 rounded-md focus:outline-none"
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
          />
          <div className="h-3 text-xs">{errors?.email && errors.email}</div>
        </div>
        <input type="hidden" name="redirect_to" value={`${redirectTo}`} />
        <div className="w-full mb-6">
          <label
            className="block uppercase font-semibold text-gray-600 text-base"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            className="w-full font-normal border py-2 px-4 text-gray-700 hover:bg-gray-50 focus:border-indigo-500 rounded-md focus:outline-none"
            name="password"
            type="password"
            required
            placeholder="************"
          />
          <div className="h-3 text-xs">
            {errors?.password && errors.password}
          </div>
        </div>
        <div className="w-full mb-6 flex justify-between items-center">
          <button
            type="submit"
            className={`btn btn-primary ${
              transition.state === 'submitting' && 'loading'
            }`}
            disabled={transition.state === 'submitting'}
          >
            {isSignInProp ? `Entrar` : `Cadastrar!`}
          </button>

          <div className="text-right">
            <small className="block">
              {isSignInProp ? `Não tem uma conta?` : `Já tem conta?`}
            </small>
            <a href={authUrl} title="Sign Up">
              {isSignInProp ? `Cadastre-se!` : `Entre aqui!`}
            </a>
          </div>
        </div>
      </fieldset>
    </Form>
  );
}

export default AuthForm;

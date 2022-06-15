import * as yup from 'yup';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { Form, Link, useSearchParams, useTransition } from "@remix-run/react";
import { withYup } from '@remix-validated-form/with-yup';
import { ValidatedForm } from 'remix-validated-form';
import { CustomInput } from '~/components/custom-input';

const validator = withYup(
  yup.object({
    email: yup
      .string()
      .email('Deve ser um e-mail válido')
      .required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatório'),
    redirect_to: yup.string().required(),
  })
);

export type AuthCreds = {
  email?: string;
  password?: string;
};

type LoginFormProps = {
  errorMessage?: string;
};

function LoginForm({
  errorMessage,
}: PropsWithChildren<LoginFormProps>): ReactElement {
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
    setAuthUrl(`/cadastrar${redirectToQueryString}`);
  }, [setAuthUrl, redirectTo]);
  let transition = useTransition();

  return (
    <ValidatedForm
      validator={validator}
      method="post"
      className="w-full bg-gray-50 px-10 py-8 rounded-md shadow-md"
    >
      <fieldset>
        <legend className="text-purple-600 pb-4 text-4xl border-b mb-4">
          Olá, entre!
        </legend>
        {errorMessage && (
          <div className="text-red-600">{errorMessage}</div>
        )}
        <br />
        <div className="w-full mb-6">
          <CustomInput
            label="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            labelClassname="block uppercase font-semibold text-gray-600 text-base"
            inputClassName="w-full font-normal border py-2 px-4 text-gray-700 hover:bg-gray-50 focus:border-indigo-500 rounded-md focus:outline-none"
          />
        </div>
        <input type="hidden" name="redirect_to" value={`${redirectTo}`} />
        <div className="w-full mb-6">
          <CustomInput
            label="Senha"
            name="password"
            type="password"
            placeholder="************"
            labelClassname="block uppercase font-semibold text-gray-600 text-base"
            inputClassName="w-full font-normal border py-2 px-4 text-gray-700 hover:bg-gray-50 focus:border-indigo-500 rounded-md focus:outline-none"
          />
        </div>
        <div className="w-full mb-6 flex justify-between items-center">
          <button
            type="submit"
            className={`btn btn-primary ${
              transition.state === 'submitting' && 'loading'
            }`}
            disabled={transition.state === 'submitting'}
          >
            Entrar
          </button>

          <div className="text-right">
            <small className="block">Esqueceu sua senha?</small>
            <Link to="/esqueci-minha-senha" title="Esqueci minha senha">
              Clique aqui
            </Link>
          </div>

          <div className="text-right">
            <small className="block">Não tem uma conta?</small>
            <Link to={authUrl} title="cadastrar">
              Cadastre-se!
            </Link>
          </div>
        </div>
      </fieldset>
    </ValidatedForm>
  );
}

const LoginFormValidator = validator;

export { LoginForm };
export { LoginFormValidator };

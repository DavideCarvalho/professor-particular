import * as yup from 'yup';
import { ReactElement, useEffect, useState } from 'react';
import { Link, useSearchParams, useTransition } from 'remix';
import { CustomInput } from '~/components/custom-input';
import { withYup } from '@remix-validated-form/with-yup';
import { ValidatedForm } from 'remix-validated-form';

const validator = withYup(
  yup.object({
    name: yup.string().required('Nome é obrigatório'),
    email: yup
      .string()
      .email('Deve ser um e-mail válido')
      .required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatório'),
    redirect_to: yup.string().required(),
  })
);

type SignUpFormProps = {
  errorMessage?: string | undefined;
};

function SignUpForm({ errorMessage }: SignUpFormProps): ReactElement {
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
    setAuthUrl(`/login${redirectToQueryString}`);
  }, [setAuthUrl, redirectTo]);
  let transition = useTransition();

  return (
    <ValidatedForm
      validator={validator}
      className="w-full bg-gray-50 px-10 py-8 rounded-md shadow-md"
      method="post"
    >
      <fieldset>
        <legend className="text-purple-600 pb-4 text-4xl border-b mb-4">
          Cadastro de professor
        </legend>
        {errorMessage && <div className="h-3 text-xs">{errorMessage}</div>}
        <br />
        <div className="w-full mb-6">
          <CustomInput
            label="nome"
            name="name"
            type="text"
            placeholder="Seu nome"
            labelClassname="block uppercase font-semibold text-gray-600 text-base"
            inputClassName="w-full font-normal border py-2 px-4 text-gray-700 hover:bg-gray-50 focus:border-indigo-500 rounded-md focus:outline-none"
          />
        </div>
        <CustomInput
          label="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          labelClassname="block uppercase font-semibold text-gray-600 text-base"
          inputClassName="w-full font-normal border py-2 px-4 text-gray-700 hover:bg-gray-50 focus:border-indigo-500 rounded-md focus:outline-none"
        />
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
            Cadastrar
          </button>

          <div className="text-right">
            <small className="block">Esqueceu sua senha?</small>
            <Link to="/esqueci-minha-senha">Clique aqui</Link>
          </div>

          <div className="text-right">
            <small className="block">Já tem conta?</small>
            <Link to={authUrl} title="login">
              Entre aqui!
            </Link>
          </div>
        </div>
      </fieldset>
    </ValidatedForm>
  );
}

const SignUpFormValidator = validator;

export { SignUpForm };
export { SignUpFormValidator };

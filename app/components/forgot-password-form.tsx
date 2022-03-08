import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { Form, useSearchParams, useTransition } from 'remix';

export type AuthCreds = {
  email?: string;
  password?: string;
};

type AuthFormProps = {
  errors?: AuthCreds & { service?: Array<string> };
  result?: string;
};

function ForgotPasswordForm({
  errors = {},
  result
}: PropsWithChildren<AuthFormProps>): ReactElement {
  let transition = useTransition();
  return (
    <Form
      className="w-full bg-gray-50 px-10 py-8 rounded-md shadow-md"
      method="post"
    >
      <fieldset>
        <legend className="text-purple-600 pb-4 text-4xl border-b mb-4">
          Trocar senha
        </legend>
        <div className="h-3 text-xs">
          {errors?.service && errors.service.map((error) => error)}
        </div>
        <br />
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
          <div className="h-3 text-xs">{result}</div>
        </div>
        <div className="w-full mb-6 flex justify-between items-center">
          <button
            type="submit"
            className={`btn btn-primary ${
              transition.state === 'submitting' && 'loading'
            }`}
            disabled={transition.state === 'submitting'}
          >
            Confirmar
          </button>
        </div>
      </fieldset>
    </Form>
  );
}

export default ForgotPasswordForm;

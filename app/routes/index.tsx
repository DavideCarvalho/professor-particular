import { useState } from 'react';
import {
  MdOutlineAttachMoney,
  MdOutlineInfo,
  MdOutlineUploadFile,
} from 'react-icons/md';
import { Link } from 'remix';
import { Form } from '@remix-run/react';

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div>
      <section className="w-full px-6 pb-12 antialiased bg-white">
        <div className="mx-auto max-w-7xl">
          <nav className="relative z-50 h-24 select-none">
            <div className="container relative flex flex-wrap items-center justify-between h-24 mx-auto overflow-hidden font-medium border-b border-gray-200 md:overflow-visible lg:justify-center sm:px-4 md:px-2">
              <div className="flex items-center justify-start w-1/4 h-full pr-4">
                <a href="#_" className="inline-block py-4 md:py-0">
                  <span className="p-1 text-xl font-black leading-none text-gray-900">
                    <span>orange</span>
                    <span className="text-indigo-600">.</span>
                  </span>
                </a>
              </div>
              <div
                className={`top-0 left-0 items-start w-full h-full p-4 text-sm bg-gray-900 bg-opacity-50 md:items-center md:w-3/4 md:absolute lg:text-base md:bg-transparent md:p-0 md:relative md:flex ${
                  showMenu ? 'flex fixed' : 'hidden'
                }`}
              >
                <div className="flex-col w-full h-auto overflow-hidden bg-white rounded-lg md:bg-transparent md:overflow-visible md:rounded-none md:relative md:flex md:flex-row">
                  <a
                    href="#_"
                    className="inline-flex items-center block w-auto h-16 px-6 text-xl font-black leading-none text-gray-900 md:hidden"
                  >
                    orange<span className="text-indigo-600">.</span>
                  </a>
                  <div className="flex flex-col items-start justify-center w-full space-x-6 text-center lg:space-x-8 md:w-2/3 md:mt-0 md:flex-row md:items-center">
                    <a
                      href="#_"
                      className="inline-block w-full py-2 mx-0 ml-6 font-medium text-left text-indigo-600 md:ml-0 md:w-auto md:px-0 md:mx-2 lg:mx-3 md:text-center"
                    >
                      Inicio
                    </a>
                    <a
                      href="#_"
                      className="inline-block w-full py-2 mx-0 font-medium text-left text-gray-700 md:w-auto md:px-0 md:mx-2 hover:text-indigo-600 lg:mx-3 md:text-center"
                    >
                      Funcionalidades
                    </a>
                  </div>
                  <div className="flex flex-col items-start justify-end w-full pt-4 md:items-center md:w-1/3 md:flex-row md:py-0">
                    <Link
                      to="/login"
                      className="w-full px-6 py-2 mr-0 text-gray-700 md:px-0 lg:pl-2 md:mr-4 lg:mr-5 md:w-auto"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/cadastrar"
                      className="inline-flex items-center w-full px-6 py-3 text-sm font-medium leading-4 text-white bg-indigo-600 md:px-3 md:w-auto md:rounded-full lg:px-5 hover:bg-indigo-500 focus:outline-none md:focus:ring-2 focus:ring-0 focus:ring-offset-2 focus:ring-indigo-600"
                    >
                      Cadastrar
                    </Link>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setShowMenu(!showMenu)}
                className="absolute right-0 flex flex-col items-center items-end justify-center w-10 h-10 bg-white rounded-full cursor-pointer md:hidden hover:bg-gray-100"
              >
                {!showMenu && (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
                {showMenu && (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            </div>
          </nav>

          <div className="container max-w-lg px-4 py-32 mx-auto text-left md:max-w-none md:text-center">
            <h1 className="text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl">
              <span className="inline md:block">Comece a planejar</span>{' '}
              <span className="relative mt-2 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-500 md:inline-block">
                Sua próxima aula!
              </span>
            </h1>
            <div className="mx-auto mt-5 text-gray-500 md:mt-12 md:max-w-lg md:text-center lg:text-lg">
              Centralize informações das suas aulas particulares, faça gestão
              dos seus materiais, avalie seus alunos e muito mais!
            </div>
            <div className="flex flex-col items-center mt-12 text-center">
              <span className="relative inline-flex w-full md:w-auto">
                <a
                  href="#_"
                  type="button"
                  className="inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold leading-6 text-white bg-indigo-600 border border-transparent rounded-full md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  Assinar agora!
                </a>
                <span className="absolute top-0 right-0 px-2 py-1 -mt-3 -mr-6 text-xs font-medium leading-tight text-white bg-green-400 rounded-full">
                  apenas R$5/mês
                </span>
              </span>
              <a href="#" className="mt-3 text-sm text-indigo-500">
                Veja mais!
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-center">
            Funcionalidades!
          </h2>
          <p className="mt-2 text-lg text-center text-gray-600">
            Fizemos uma lista pra te falar como podemos te ajudar
          </p>
          <div className="grid grid-cols-8 gap-8 mt-10 sm:px-8 xl:px-0">
            <div className="relative flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 overflow-hidden bg-gray-100 sm:rounded-xl">
              <div className="p-3 text-white bg-blue-500 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 "
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5" />
                  <circle cx="6" cy="14" r="3" />
                  <path d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5" />
                </svg>
              </div>
              <h4 className="text-xl font-medium text-gray-700">Avaliações</h4>
              <p className="text-base text-center text-gray-500">
                Você pode avaliar o desempenho do seu aluno a cada aula. Seus
                alunos podem fazer auto avaliações também
              </p>
            </div>

            <div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">
              <div className="p-3 text-white bg-blue-500 rounded-full">
                <MdOutlineUploadFile size={30} />
              </div>
              <h4 className="text-xl font-medium text-gray-700">
                Upload de arquivos
              </h4>
              <p className="text-base text-center text-gray-500">
                Faça upload dos materiais das aulas. Seus materiais nunca mais
                vão se perder, e seus alunos sempre vão ter um lugar pra
                baixa-los
              </p>
            </div>

            <div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">
              <div className="p-3 text-white bg-blue-500 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 "
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <MdOutlineAttachMoney size={25} />
                </svg>
              </div>
              <h4 className="text-xl font-medium text-gray-700">Pagamentos</h4>
              <p className="text-base text-center text-gray-500">
                Saiba quais aulas você já recebeu, e quais aulas você ainda
                precisa receber
              </p>
            </div>

            <div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">
              <div className="p-3 text-white bg-blue-500 rounded-full">
                <MdOutlineInfo size={30} />
              </div>
              <h4 className="text-xl font-medium text-gray-700">
                HUB de informações
              </h4>
              <p className="text-base text-center text-gray-500">
                Tenha todas as informações pra gerir suas aulas particulares em
                um só lugar!
              </p>
            </div>

            {/*<div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">*/}
            {/*  <div className="p-3 text-white bg-blue-500 rounded-full">*/}
            {/*    <svg*/}
            {/*      xmlns="http://www.w3.org/2000/svg"*/}
            {/*      className="w-8 h-8 "*/}
            {/*      viewBox="0 0 24 24"*/}
            {/*      strokeWidth="1.5"*/}
            {/*      stroke="currentColor"*/}
            {/*      fill="none"*/}
            {/*      strokeLinecap="round"*/}
            {/*      strokeLinejoin="round"*/}
            {/*    >*/}
            {/*      <path stroke="none" d="M0 0h24v24H0z" fill="none" />*/}
            {/*      <line x1="9.5" y1="11" x2="9.51" y2="11" />*/}
            {/*      <line x1="14.5" y1="11" x2="14.51" y2="11" />*/}
            {/*      <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />*/}
            {/*      <path d="M7 5h1v-2h8v2h1a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3v1h-10v-1a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3" />*/}
            {/*    </svg>*/}
            {/*  </div>*/}
            {/*  <h4 className="text-xl font-medium text-gray-700">*/}
            {/*    Building Blocks*/}
            {/*  </h4>*/}
            {/*  <p className="text-base text-center text-gray-500">*/}
            {/*    The right kind of building blocks to take your company to the*/}
            {/*    next level.*/}
            {/*  </p>*/}
            {/*</div>*/}

            {/*<div className="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl">*/}
            {/*  <div className="p-3 text-white bg-blue-500 rounded-full">*/}
            {/*    <svg*/}
            {/*      xmlns="http://www.w3.org/2000/svg"*/}
            {/*      className="w-8 h-8 "*/}
            {/*      viewBox="0 0 24 24"*/}
            {/*      strokeWidth="1.5"*/}
            {/*      stroke="currentColor"*/}
            {/*      fill="none"*/}
            {/*      strokeLinecap="round"*/}
            {/*      strokeLinejoin="round"*/}
            {/*    >*/}
            {/*      <path stroke="none" d="M0 0h24v24H0z" fill="none" />*/}
            {/*      <line x1="15" y1="5" x2="15" y2="7" />*/}
            {/*      <line x1="15" y1="11" x2="15" y2="13" />*/}
            {/*      <line x1="15" y1="17" x2="15" y2="19" />*/}
            {/*      <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2" />*/}
            {/*    </svg>*/}
            {/*  </div>*/}
            {/*  <h4 className="text-xl font-medium text-gray-700">Coupons</h4>*/}
            {/*  <p className="text-base text-center text-gray-500">*/}
            {/*    Coupons system to provide special offers and discounts for your*/}
            {/*    app.*/}
            {/*  </p>*/}
            {/*</div>*/}
          </div>
        </div>
      </section>

      <section className="w-full px-8 py-16 xl:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center md:flex-row">
            <div className="w-full space-y-5 md:w-3/5 md:pr-16">
              {/*<p className="font-medium text-blue-500 uppercase">*/}
              {/*  Building Businesses*/}
              {/*</p>*/}
              <h2 className="text-2xl font-extrabold leading-none text-black sm:text-3xl md:text-5xl">
                Mudando o jeito dos professores de gerirem suas aulas.
              </h2>
              <p className="text-xl text-gray-600 md:pr-16">
                Entre agora e crie suas 2 primeiras aulas particulares grátis!
              </p>
            </div>

            <div className="w-full mt-16 md:mt-0 md:w-2/5">
              <div className="relative z-10 h-auto p-8 py-10 overflow-hidden bg-white border-b-2 border-gray-300 rounded-lg shadow-2xl px-7">
                <h3 className="mb-6 text-2xl font-medium text-center">
                  Crie sua conta
                </h3>
                <Form method="post" action="/cadastrar">
                  <input
                    type="text"
                    name="email"
                    className="block w-full px-4 py-3 mb-4 border border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                    placeholder="meu@email.com"
                  />
                  <input
                    type="password"
                    name="password"
                    className="block w-full px-4 py-3 mb-4 border border-2 border-transparent border-gray-200 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                    placeholder="********"
                    style={{
                      cursor: 'auto',
                      backgroundSize: '20px 20px !important',
                      backgroundPosition: '98% 50% !important',
                      backgroundRepeat: 'no-repeat !important',
                      backgroundImage:
                        'url("chrome-extension://ehpbfbahieociaeckccnklpdcmfaeegd/Icon-20.png") !important',
                    }}
                  />
                  <div className="block">
                    <button
                      type="submit"
                      className="w-full px-3 py-4 font-medium text-white bg-blue-600 rounded-lg"
                    >
                      Criar
                    </button>
                  </div>
                </Form>
                <p className="w-full mt-4 text-sm text-center text-gray-500">
                  Já tem sua conta?{' '}
                  <Link to="/login" className="text-blue-500 underline">
                    Clique aqui!
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-gray-700 bg-white body-font">
        <div className="container flex flex-col items-center px-8 py-8 mx-auto max-w-7xl sm:flex-row">
          <a
            href="#_"
            className="text-xl font-black leading-none text-gray-900 select-none logo"
          >
            orange<span className="text-indigo-600">.</span>
          </a>
          {/*<p className="mt-4 text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-200 sm:mt-0">*/}
          {/*© 2021 Tails - Tailwindcss Page Builder*/}
          {/*</p>*/}
          {/*<span className="inline-flex justify-center mt-4 space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">*/}
          {/*  <a href="#" className="text-gray-400 hover:text-gray-500">*/}
          {/*    <span className="sr-only">Facebook</span>*/}
          {/*    <svg*/}
          {/*      className="w-6 h-6"*/}
          {/*      fill="currentColor"*/}
          {/*      viewBox="0 0 24 24"*/}
          {/*      aria-hidden="true"*/}
          {/*    >*/}
          {/*      <path*/}
          {/*        fillRule="evenodd"*/}
          {/*        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"*/}
          {/*        clipRule="evenodd"*/}
          {/*      />*/}
          {/*    </svg>*/}
          {/*  </a>*/}

          {/*  <a href="#" className="text-gray-400 hover:text-gray-500">*/}
          {/*    <span className="sr-only">Instagram</span>*/}
          {/*    <svg*/}
          {/*      className="w-6 h-6"*/}
          {/*      fill="currentColor"*/}
          {/*      viewBox="0 0 24 24"*/}
          {/*      aria-hidden="true"*/}
          {/*    >*/}
          {/*      <path*/}
          {/*        fillRule="evenodd"*/}
          {/*        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"*/}
          {/*        clipRule="evenodd"*/}
          {/*      />*/}
          {/*    </svg>*/}
          {/*  </a>*/}

          {/*  <a href="#" className="text-gray-400 hover:text-gray-500">*/}
          {/*    <span className="sr-only">Twitter</span>*/}
          {/*    <svg*/}
          {/*      className="w-6 h-6"*/}
          {/*      fill="currentColor"*/}
          {/*      viewBox="0 0 24 24"*/}
          {/*      aria-hidden="true"*/}
          {/*    >*/}
          {/*      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />*/}
          {/*    </svg>*/}
          {/*  </a>*/}

          {/*  <a href="#" className="text-gray-400 hover:text-gray-500">*/}
          {/*    <span className="sr-only">GitHub</span>*/}
          {/*    <svg*/}
          {/*      className="w-6 h-6"*/}
          {/*      fill="currentColor"*/}
          {/*      viewBox="0 0 24 24"*/}
          {/*      aria-hidden="true"*/}
          {/*    >*/}
          {/*      <path*/}
          {/*        fillRule="evenodd"*/}
          {/*        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"*/}
          {/*        clipRule="evenodd"*/}
          {/*      />*/}
          {/*    </svg>*/}
          {/*  </a>*/}

          {/*  <a href="#" className="text-gray-400 hover:text-gray-500">*/}
          {/*    <span className="sr-only">Dribbble</span>*/}
          {/*    <svg*/}
          {/*      className="w-6 h-6"*/}
          {/*      fill="currentColor"*/}
          {/*      viewBox="0 0 24 24"*/}
          {/*      aria-hidden="true"*/}
          {/*    >*/}
          {/*      <path*/}
          {/*        fillRule="evenodd"*/}
          {/*        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"*/}
          {/*        clipRule="evenodd"*/}
          {/*      />*/}
          {/*    </svg>*/}
          {/*  </a>*/}
          {/*</span>*/}
        </div>
      </section>
    </div>
  );
}

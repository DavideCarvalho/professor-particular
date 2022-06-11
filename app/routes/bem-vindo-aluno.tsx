import { AppLayout } from '~/components/AppLayout';
import { PartyPopperEmoji } from '~/components/party-popper-emoji.component';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { useEffect, useState } from 'react';

const WelcomeStudentPage = () => {
  const { height, width } = useWindowSize();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, [setShow]);
  return (
    <AppLayout>
      {show && <Confetti width={width} height={height} />}
      <div className="flex flex-col w-full h-full justify-center content-center place-items-center">
        <PartyPopperEmoji className="h-64" />
        <h1 className="text-4xl font-bold">
          Bem vindo aluno ao Pró-fessor!
        </h1>

        <h1 className="text-2xl mt-10 break-words">
          Agora falta só mais um passo. Te mandamos um e-mail de confirmação de
          cadastro. Clique nele, e depois, você já pode aproveitar suas aulas!
        </h1>
      </div>
    </AppLayout>
  );
};

export default WelcomeStudentPage;

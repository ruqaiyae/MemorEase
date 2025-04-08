import { FormEvent, ReactNode } from 'react';
import { Container } from '../Layout/Container';

type Props = {
  text: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function FormContainer({ text, children, onSubmit }: Props) {
  return (
    <>
      <h1 className="font-fondamento font-bold text-[#654A2F] text-[15px] md:text-[40px] text-center my-3 md:my-10">
        {text}
      </h1>
      <Container mobileWidth="60%" width="50%">
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="text-center mt-6 md:mt-12">{children}</div>
        </form>
      </Container>
    </>
  );
}

import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, useUser } from '../Components/UserManagement/useUser';
import { Container } from '../Components/Container';
import { FormInput } from '../Components/UserManagement/FormInput';
import { PasswordInput } from '../Components/UserManagement/PasswordInput';

type AuthData = {
  user: User;
  token: string;
};

export function SignIn() {
  const { handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = (await res.json()) as AuthData;
      handleSignIn(user, token);
      navigate('/');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="font-[Parisienne] font-bold text-[#654A2F] text-[15px] md:text-[40px] text-center my-3 md:my-6">
        Preserve Your Legacy, One Memory at a Time
      </h1>
      <Container width="50%">
        <form onSubmit={handleSubmit}>
          <div className="text-end">
            <div className="mt-6 md:mt-12 mr-10 md:mr-30">
              <FormInput labelName={'Username:'} name={'username'} />
              <PasswordInput labelName={'Password:'} />
            </div>
          </div>
          <div className="text-center">
            <button
              disabled={isLoading}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 my-3 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px]">
              Sign In
            </button>
            <p className="font-[Lato] text-[#654A2F] text-[8px] md:text-[15px] mb-5 md:mb-8">
              Don&apos;t have an account?{' '}
              <span
                onClick={() => navigate('/sign-up')}
                className="font-bold underline">
                Sign up
              </span>
            </p>
          </div>
        </form>
      </Container>
    </>
  );
}

import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Components/UserManagement/useUser';
import { Container } from '../../Components/Layout/Container';
import { FormInput } from '../../Components/UserManagement/FormInput';
import { PasswordInput } from '../../Components/UserManagement/PasswordInput';
import { type Auth, type SignInUser, requestSignIn } from '../../Lib/data';
import { errorMsg } from '../../Components/Toast/errorToast';

export function SignIn() {
  const { handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData) as SignInUser;
      const { user, token } = (await requestSignIn(userData)) as Auth;
      handleSignIn(user, token);
      // update: navigate to the family selection page, where the user picks a family space before entering its dashboard.
      navigate('/');
      window.scrollTo(0, 0);
    } catch (err) {
      errorMsg('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="font-[fondamento] font-bold text-[#654A2F] text-[15px] md:text-[40px] text-center my-3 md:my-10">
        Preserve Your Legacy, One Memory at a Time
      </h1>
      <Container mobileWidth="60%" width="50%">
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
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 my-3 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              Sign In
            </button>
            <p className="font-[Lato] text-[#654A2F] text-[8px] md:text-[15px] mb-5 md:mb-8">
              Don&apos;t have an account?{' '}
              <span
                onClick={() => {
                  navigate('/sign-up');
                  window.scrollTo(0, 0);
                }}
                className="font-bold underline cursor-pointer">
                Sign up
              </span>
            </p>
          </div>
        </form>
      </Container>
    </>
  );
}

import { FormEvent, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../Components/Layout/Container';
import { FormInput } from '../../Components/UserManagement/FormInput';
import { PasswordInput } from '../../Components/UserManagement/PasswordInput';
import { type Auth, type SignUpUser, requestSignUp } from '../../Lib/data';
import { useUser } from '../../Components/UserManagement/useUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

export function SignUp() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<unknown>();
  const [icon, setIcon] = useState<ReactNode>(null);
  const [valid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSignIn } = useUser();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const iconClass = 'text-[#654a2f] absolute translateX-(50%)';
    if (password === e.target.value) {
      setIcon(<FontAwesomeIcon icon={faCircleCheck} className={iconClass} />);
      setIsValid(true);
    } else {
      setIcon(<FontAwesomeIcon icon={faCircleXmark} className={iconClass} />);
      setIsValid(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (!valid) throw new Error('Passwords must match');
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData) as SignUpUser;
      const { user, token } = (await requestSignUp(userData)) as Auth;
      handleSignIn(user, token);
      navigate(`/family-form?action=signup-success`);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  let message;
  if (error) {
    message = (
      <div className="flex items-center ml-10 md:ml-70 mb-2">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="text-[#B22222] text-[7px] md:text-[12px]"
        />
        <p className="w-100 text-center md:text-left text-[#B22222] text-[7px] md:text-[12px] md:p-2">
          Username taken. Please try another.
        </p>
      </div>
    );
  }

  let passwordError = '';
  if (password.length === 0)
    passwordError =
      'Password must be at least 8 characters long, include at least 1 digit, 1 special character, and 1 uppercase letter.';
  else if (password.length < 8) passwordError = 'Your password is too short.';
  else if (!password.match(/\d/)) passwordError = 'Must include a digit';
  else if (!password.match(/[A-Z]/))
    passwordError = 'Must include an uppercase letter';
  else if (!password.match(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/))
    passwordError = 'Must include a special character';

  return (
    <>
      <h1 className="font-[fondamento] font-bold text-[#654A2F] text-[15px] md:text-[40px] text-center my-3 md:my-10">
        Preserve Your Legacy, One Memory at a Time
      </h1>
      <Container mobileWidth="60%" width="50%">
        <form onSubmit={handleSubmit}>
          <div className="text-end">
            <div className="mt-6 md:mt-12 mr-10 md:mr-30">
              <FormInput labelName={'First Name:'} name={'firstName'} />
              <FormInput labelName={'Last Name:'} name={'lastName'} />
              <FormInput labelName={'Username:'} name={'username'} />
              {message}
              <PasswordInput
                labelName={'Password:'}
                onInput={(e) => setPassword(e.target.value)}
              />
            </div>
            {passwordError !== '' && (
              <div className="flex items-start mb-2 md:ml-60 mx-2">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="text-[#B22222] text-[7px] mt-0.5 md:mt-2 md:text-[12px]"
                />
                <p className="w-100 items-center md:text-left text-[#B22222] text-[7px] md:text-[12px] md:p-1 ">
                  {passwordError}
                </p>
              </div>
            )}
            <div className="mr-10 md:mr-30">
              <PasswordInput
                labelName={'Confirm Password:'}
                onInput={(e) => handleChange(e)}
                icon={icon}
              />
            </div>
          </div>
          <div className="text-center">
            <button
              disabled={isLoading}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 my-3 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              Create Account
            </button>
            <p className="font-[Lato] text-[#654A2F] text-[8px] md:text-[15px] mb-5 md:mb-8">
              Already have an account?{' '}
              <span
                onClick={() => {
                  navigate('/sign-in');
                }}
                className="font-bold underline cursor-pointer">
                Log in
              </span>
            </p>
          </div>
        </form>
      </Container>
    </>
  );
}

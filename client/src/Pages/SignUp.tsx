import { FormEvent, ReactNode, useState } from 'react';
import { Container } from '../Components/Layout/Container';
import { FormInput } from '../Components/UserManagement/FormInput';
import { useNavigate } from 'react-router-dom';
// import { User } from '../Components/UserManagement/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { PasswordInput } from '../Components/UserManagement/PasswordInput';

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
};

export function SignUp() {
  const [password, setPassword] = useState('');
  const [icon, setIcon] = useState<ReactNode>(null);
  const [valid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const iconClass = 'text-[#654a2f] absolute translateX-(50%)';
    if (password === e.target.value) {
      setIcon(<FontAwesomeIcon icon={faCircleCheck} className={iconClass} />);
      setIsValid(true);
    } else {
      setIcon(<FontAwesomeIcon icon={faCircleXmark} className={iconClass} />);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (valid === false) throw new Error('Passwords must match');
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = (await res.json()) as User;
      console.log('Registered', user);
      alert(
        `Successfully registered ${user.firstName} ${user.lastName} as ${user.username}.`
      );
      navigate('/');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="font-[Parisienne] font-bold text-[#654A2F] text-[15px] md:text-[40px] text-center my-3 md:my-6">
        Preserve Your Legacy, One Memory at a Time
      </h1>
      <Container mobileWidth="60%" width="50%">
        <form onSubmit={handleSubmit}>
          <div className="text-end">
            <div className="mt-6 md:mt-12 mr-10 md:mr-30">
              <FormInput labelName={'First Name:'} name={'firstName'} />
              <FormInput labelName={'Last Name:'} name={'lastName'} />
              <FormInput labelName={'Username:'} name={'username'} />
              <PasswordInput
                labelName={'Password:'}
                onInput={(e) => setPassword(e.target.value)}
              />
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
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 my-3 md:mt-6 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px]">
              Create Account
            </button>
            <p className="font-[Lato] text-[#654A2F] text-[8px] md:text-[15px] mb-5 md:mb-8">
              Already have an account?{' '}
              <span
                onClick={() => navigate('/sign-in')}
                className="font-bold underline">
                Log in
              </span>
            </p>
          </div>
        </form>
      </Container>
    </>
  );
}

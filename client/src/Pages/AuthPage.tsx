import { SignUp } from './SignUp';
import { SignIn } from './SignIn';

type Props = {
  mode: 'sign-up' | 'sign-in';
};
export function AuthPage({ mode }: Props) {
  return (
    <div>
      {mode === 'sign-up' && <SignUp />}
      {mode === 'sign-in' && <SignIn />}
    </div>
  );
}

import { toast } from 'react-toastify';
import { Msg } from './Toast';

export function errorMsg(text: string) {
  toast(<Msg message={text} />);
}

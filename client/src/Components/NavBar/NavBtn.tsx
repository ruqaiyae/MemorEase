import { Link } from 'react-router-dom';

type Props = {
  btnName: string;
  path: string;
};

export function NavBtn({ btnName, path }: Props) {
  return (
    <Link to={path}>
      <button className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-[8px] rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[15px] cursor-pointer">
        {btnName}
      </button>
    </Link>
  );
}

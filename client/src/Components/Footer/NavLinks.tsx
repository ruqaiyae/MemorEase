import { Link } from 'react-router-dom';

type Props = {
  link: string;
  name: string;
};

export function FooterLinks({ link, name }: Props) {
  const linkClass =
    'font-lato text-[#EBD199] text-[8px] block md:text-xl py-[1px]';

  return (
    <Link to={link} className={linkClass}>
      {name}
    </Link>
  );
}

import { Link } from 'react-router-dom';

type Prop = {
  link: string;
  name: string;
};

export function FooterLinks({ link, name }: Prop) {
  const linkClass =
    'font-[Lato] text-[#EBD199] text-[8px] block md:text-xl py-[1px]';

  return (
    <Link to={link} className={linkClass}>
      {name}
    </Link>
  );
}

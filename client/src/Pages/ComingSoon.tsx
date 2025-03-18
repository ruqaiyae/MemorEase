import { Link } from 'react-router-dom';

export function ComingSoon() {
  return (
    <div className="h-[70%] py-[60%] md:py-[14%]">
      <h1 className="font-[Fondamento] text-[#654A2F] text-xs md:text-2xl text-center">
        We're working hard to build something amazing! Back to{' '}
        <Link to={'/'} className="font-extrabold underline">
          Home
        </Link>
      </h1>
    </div>
  );
}

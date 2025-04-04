import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

type Props = {
  imgSrc: string | undefined;
  onRemove: () => void;
};

export function EditImage({ imgSrc, onRemove }: Props) {
  return (
    <div className="inline-block relative">
      <div className="flex justify-center">
        <img
          className="mb-3 mt-3 md:mt-6 border-2 border-[#654A2F] rounded-lg"
          src={imgSrc}
          alt="Image preview"
        />
      </div>
      <FontAwesomeIcon
        icon={faCircleXmark}
        onClick={onRemove}
        className="text-[#654a2f] text-[15px] md:text-[25px] cursor-pointer absolute top-1 md:top-3 -right-2"
      />
    </div>
  );
}

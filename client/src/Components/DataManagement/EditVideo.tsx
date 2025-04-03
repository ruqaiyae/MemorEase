import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

type Props = {
  videoSrc: string | undefined;
  type?: string;
  onRemove: () => void;
};

export function EditVideo({ videoSrc, type, onRemove }: Props) {
  return (
    <div className="inline-block relative">
      <div className="flex justify-center">
        <video
          controls
          className="mb-3 mt-3 md:mt-6 border-2 border-[#654A2F] rounded-lg"
          preload="metadata">
          <source src={videoSrc} type={type} />
          Your browser does not support the video tag.
        </video>
      </div>
      <FontAwesomeIcon
        icon={faCircleXmark}
        onClick={onRemove}
        className="text-[#654a2f] text-[15px] md:text-[25px] cursor-pointer absolute top-1 md:top-3 -right-2"
      />
    </div>
  );
}

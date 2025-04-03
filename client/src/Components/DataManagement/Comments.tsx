import { type Comment } from '../../Lib/data';
import { useUser } from '../UserManagement/useUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

type Props = {
  width: string;
  onCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  comments: Comment[];
  onDelete: (e: number) => void;
};

export function Comments({
  width,
  onCommentSubmit,
  onInputChange,
  value,
  comments,
  onDelete,
}: Props) {
  const { user } = useUser();

  return (
    <div style={{ width }} className="md:w-[50%]">
      <p className="text-[#654A2F] text-[12px] md:text-[20px] mt-5">
        Comments:
      </p>
      <form onSubmit={(e) => onCommentSubmit(e)}>
        <label>
          <input
            placeholder="Add your comment"
            onChange={(e) => onInputChange(e)}
            value={value}
            className="border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md px-1 md:p-4 md:h-8 w-[100%] md:w-[600px] mt-1 text-[#654A2F] text-[10px] md:text-[17px]"
          />
        </label>
      </form>
      <ul className="mt-5">
        {comments?.map((comment) => (
          <li
            key={comment.commentsId}
            className="text-[#654A2F] text-[10px] md:text-[15px] mt-1 flex justify-between md:w-[600px]">
            <p>
              <span className="font-medium italic">{comment.author}</span>:{' '}
              {comment.comment}
            </p>
            {comment.author === user?.username ? (
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => onDelete(comment.commentsId)}
                className="mr-2 cursor-pointer"
              />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

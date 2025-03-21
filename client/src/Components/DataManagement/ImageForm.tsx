import { type FormEvent, useEffect, useRef, useState } from 'react';
import { uploadImage } from '../../Lib/data';
import { useNavigate, useParams } from 'react-router-dom';
import { labelClass } from '../UserManagement/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FormContainer } from './FormContainer';

export function ImageForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { familyId } = useParams();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string | undefined>();
  const uploadRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // Using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  }

  function handleRemove(): void {
    setSelectedFile(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const imageData = new FormData(event.currentTarget);
      if (selectedFile) {
        imageData.append('image', selectedFile);
      }
      await uploadImage(imageData, Number(familyId));
      handleRemove();
      navigate('/family/:familyId/dashboard/images');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <FormContainer
        text="Your family's history, captured in every frame."
        onSubmit={(e) => handleSubmit(e)}>
        {selectedFile && (
          <>
            <div className="flex justify-center">
              <img
                className="w-[60%] mb-3 mt-3 md:mt-6 border-2 border-[#654A2F] rounded-lg"
                src={preview}
              />
            </div>
            <FontAwesomeIcon
              icon={faCircleXmark}
              onClick={handleRemove}
              className="text-[#654a2f] text-[15px] md:text-[25px] absolute top-31 md:top-[34%] right-29 md:right-[34%]"
            />
          </>
        )}
        {!selectedFile && (
          <>
            {/* <button
              onClick={() => uploadRef.current?.click()}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-5 md:mb-15 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              Add a Picture to Your Memory Vault
            </button> */}

            <p className={labelClass}>Add a Picture to Your Memory Vault</p>
            <input
              required
              type="file"
              name="image"
              accept=".png, .jpg, .jpeg, .gif"
              ref={uploadRef}
              onChange={onSelectFile}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-5 md:mb-15 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer"
              // className="hidden"
            />
          </>
        )}
        <label className={labelClass}>
          Tell the Story Behind This Photo:
          <textarea
            cols={30}
            autoFocus
            id="caption"
            name="caption"
            className="block border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md  md:p-2 md:h-8  md:w-[60%] mt-[5px] mb-4 md:my-[10px] mx-auto md:h-30"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
          Upload your photo
        </button>
      </FormContainer>
    </>
  );
}

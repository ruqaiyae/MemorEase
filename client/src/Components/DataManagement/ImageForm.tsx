import { type FormEvent, useRef, useState } from 'react';
import { type Image, uploadImage } from '../../Lib/data';
import { Container } from '../../Components/Layout/Container';
import { useNavigate, useParams } from 'react-router-dom';
import { labelClass } from '../UserManagement/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export function ImageForm() {
  const { familyId } = useParams();
  const [imageFile, setImageFile] = useState<Partial<Image>>();
  const uploadRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
  //   const imgUrl = event.target.files?.[0];
  //   if (imgUrl) {
  //     setImageFile({ imageUrl: URL.createObjectURL(imgUrl) });
  //   }
  // }

  function handleRemove(): void {
    setImageFile(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      await uploadImage(formData, Number(familyId));
      handleRemove();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <h1 className="font-[fondamento] font-bold text-[#654A2F] text-[15px] md:text-[40px] text-center my-3 md:my-10">
        Preserve Your Legacy, One Memory at a Time
      </h1>
      <Container mobileWidth="60%" width="50%">
        <form onSubmit={handleSubmit}>
          <div className="text-center mt-6 md:mt-12">
            {imageFile && (
              <>
                <div className="flex justify-center">
                  <img
                    className="w-[60%] mb-3 mt-3 md:mt-6 border-2 border-[#654A2F] rounded-lg"
                    src={imageFile?.imageUrl}
                  />
                </div>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  onClick={handleRemove}
                  className="text-[#654a2f] text-[15px] md:text-[25px] absolute top-31 md:top-[34%] right-29 md:right-[34%]"
                />
              </>
            )}
            {!imageFile && (
              <>
                <button
                  onClick={() => uploadRef.current?.click()}
                  className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-5 md:mb-15 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
                  Add a Picture to Your Memory Vault
                </button>
                <input
                  required
                  type="file"
                  name="image"
                  accept=".png, .jpg, .jpeg, .gif"
                  ref={uploadRef}
                  // onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
          </div>
          <div className="text-center">
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
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-[Lato] text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              Upload
            </button>
          </div>
        </form>
      </Container>
    </>
  );
}

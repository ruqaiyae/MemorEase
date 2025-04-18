import { type FormEvent, useEffect, useRef, useState } from 'react';
import {
  type Image,
  readImage,
  uploadImage,
  updateImage,
  deleteImage,
  readImageLike,
  dislikeMemory,
  readImageComment,
  deleteComments,
} from '../../Lib/data';
import { useNavigate, useParams } from 'react-router-dom';
import { labelClass } from '../UserManagement/FormInput';
import { FormContainer } from './FormContainer';
import { errorMsg } from '../Toast/errorToast';
import { LoadingCircleSpinner } from '../LoadingSpinner';
import { EditImage } from './EditImage';

export function ImageForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { familyId, imageId } = useParams();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string | undefined>();
  const uploadRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [image, setImage] = useState<Image>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const isEditing = imageId && imageId !== '';

  useEffect(() => {
    async function load(familyId: number, imageId: number) {
      setIsLoading(true);
      try {
        const image = await readImage(familyId, imageId);
        if (!image) throw new Error(`Image with ID ${imageId} not found`);
        setImage(image);
        setImageUrl(image.imageUrl);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing && familyId) load(+familyId, +imageId);
  }, [familyId, imageId, isEditing]);

  // for image preview before submit
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
    setImageUrl(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const imageData = new FormData(event.currentTarget);

      if (!selectedFile && imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileName = imageUrl.split('/').pop() || 'existing-image.jpg';
        const file = new File([blob], fileName, { type: blob.type });

        imageData.append('image', file);
      }

      if (selectedFile) {
        imageData.append('image', selectedFile);
      }

      if (isEditing) {
        await updateImage(imageData, Number(familyId), Number(imageId));
      } else {
        await uploadImage(imageData, Number(familyId));
      }

      handleRemove();
      navigate(`/family/${familyId}/dashboard/images`);
    } catch (err) {
      errorMsg('Error uploading image');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!image?.imageId) throw new Error('Should never happen');
    try {
      const isLiked = await readImageLike(Number(familyId), image.imageId);
      isLiked &&
        (await dislikeMemory(Number(familyId), 'image', image.imageId));
      const comments = await readImageComment(Number(familyId), image.imageId);
      comments &&
        (await deleteComments(Number(familyId), 'image', image.imageId));

      await deleteImage(Number(familyId), image.imageId);
      navigate(`/family/${familyId}/dashboard/images`);
    } catch (err) {
      errorMsg('Error deleting image. Please try again.');
    }
  }

  return (
    <>
      <FormContainer
        text="Your family's history, captured in every frame."
        onSubmit={(e) => handleSubmit(e)}>
        {isEditing && imageUrl ? (
          <EditImage imgSrc={imageUrl} onRemove={handleRemove} />
        ) : selectedFile ? (
          <EditImage imgSrc={preview} onRemove={handleRemove} />
        ) : (
          <>
            <p className={labelClass}>Add a Picture to Your Memory Vault</p>
            <input
              required
              type="file"
              name="image"
              accept=".png, .jpg, .jpeg, .gif"
              ref={uploadRef}
              onChange={onSelectFile}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-5 md:mb-15 rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer"
            />
          </>
        )}
        <label className={labelClass}>
          Tell the Story Behind This Photo:
          <textarea
            cols={30}
            id="caption"
            name="caption"
            defaultValue={image?.caption ?? ''}
            required
            className="block border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md  md:p-2 md:h-8  md:w-[60%] mt-[5px] mb-4 md:my-[10px] mx-auto md:h-30"
          />
        </label>
        {isEditing ? (
          <div className="flex justify-between w-[75%] md:w-[60%] mx-auto">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              {isLoading ? (
                <LoadingCircleSpinner width="20px" height="20px" />
              ) : (
                'Delete'
              )}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              Save
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
            Upload your photo
          </button>
        )}
      </FormContainer>
    </>
  );
}

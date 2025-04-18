import { type FormEvent, useEffect, useRef, useState } from 'react';
import {
  type Video,
  readVideo,
  uploadVideo,
  updateVideo,
  deleteVideo,
  dislikeMemory,
  readVideoLike,
  readVideoComment,
  deleteComments,
} from '../../Lib/data';
import { useNavigate, useParams } from 'react-router-dom';
import { labelClass } from '../UserManagement/FormInput';
import { FormContainer } from './FormContainer';
import { errorMsg } from '../Toast/errorToast';
import { EditVideo } from './EditVideo';

export function VideoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { familyId, videoId } = useParams();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string | undefined>();
  const uploadRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video>();
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const isEditing = videoId && videoId !== '';

  useEffect(() => {
    async function load(familyId: number, videoId: number) {
      setIsLoading(true);
      try {
        const video = await readVideo(familyId, videoId);
        if (!video) throw new Error(`Video with ID ${videoId} not found`);
        setVideo(video);
        setVideoUrl(video.videoUrl);
      } catch (err) {
        errorMsg(`Error loading the video. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing && familyId) load(+familyId, +videoId);
  }, [familyId, videoId, isEditing]);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // Using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  }

  // for video preview before submit
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    console.log('selectedFile', selectedFile);
    console.log('objectUrl', objectUrl);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  function handleRemove(): void {
    setSelectedFile(undefined);
    setVideoUrl(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const videoData = new FormData(event.currentTarget);

      if (!selectedFile && videoUrl) {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const fileName = videoUrl.split('/').pop() || 'existing-video.jpg';
        const file = new File([blob], fileName, { type: blob.type });

        videoData.append('video', file);
      }

      if (selectedFile) {
        videoData.append('video', selectedFile);
      }

      if (isEditing) {
        await updateVideo(videoData, Number(familyId), Number(videoId));
      } else {
        await uploadVideo(videoData, Number(familyId));
      }

      handleRemove();
      navigate(`/family/${familyId}/dashboard/videos`);
    } catch (err) {
      errorMsg('Error uploading video');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!video?.videoId) throw new Error('Should never happen');
    try {
      const isLiked = await readVideoLike(Number(familyId), video.videoId);
      isLiked &&
        (await dislikeMemory(Number(familyId), 'video', video.videoId));

      const comments = await readVideoComment(Number(familyId), video.videoId);
      comments &&
        (await deleteComments(Number(familyId), 'video', video.videoId));

      await deleteVideo(Number(familyId), video.videoId);
      navigate(`/family/${familyId}/dashboard/videos`);
    } catch (err) {
      errorMsg('Error deleting video. Please try again.');
    }
  }

  return (
    <>
      <FormContainer
        text="Some moments are best remembered in motion."
        onSubmit={(e) => handleSubmit(e)}>
        {isEditing && videoUrl ? (
          <EditVideo videoSrc={videoUrl} onRemove={handleRemove} />
        ) : selectedFile ? (
          <EditVideo videoSrc={preview} onRemove={handleRemove} />
        ) : (
          <>
            <p className={labelClass}>Add a Video to Your Memory Vault</p>
            <input
              required
              type="file"
              name="video"
              accept="video/*"
              ref={uploadRef}
              onChange={onSelectFile}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-5 md:mb-15 rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer"
            />
          </>
        )}
        <label className={labelClass}>
          Tell the Story Behind This Video:
          <textarea
            cols={40}
            rows={10}
            id="caption"
            name="caption"
            defaultValue={video?.caption ?? ''}
            required
            className="block border md:border-2 focus:border-2 md:focus:border-3 focus:outline-none border-[#654A2F] rounded md:rounded-md md:p-2 mt-[5px] mb-4 md:my-[10px] mx-auto md:w-[90%]"
          />
        </label>
        {isEditing ? (
          <div className="flex justify-between w-[75%] md:w-[60%] mx-auto">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="btn bg-[#654A2F] px-2 md:px-7 py-[3px] md:py-3 md:mt-6 mb-10 md:mb-15 rounded-lg md:rounded-full font-lato text-[#EBD199] text-[8px] md:text-[18px] cursor-pointer">
              Delete
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
            Upload your video
          </button>
        )}
      </FormContainer>
    </>
  );
}

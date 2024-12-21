"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { TrashSimple, UploadSimple } from "@phosphor-icons/react";
import Cropper from "react-easy-crop";
import { v4 as uuidv4 } from "uuid"; // Import UUID

export default function ProfilePictureUploader({
  dentistryId,
}: {
  dentistryId: string;
}) {
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  // State variables for cropping functionality
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dentistryId) {
      fetchProfilePicture();
    }
  }, [dentistryId]);

  // Fetch existing profile picture
  async function fetchProfilePicture() {
    try {
      const { data, error } = await supabase.storage
        .from("profile-pics")
        .list(dentistryId);

      if (error) throw error;

      if (data.length > 0) {
        // Assuming the latest file has the latest timestamp in its name
        const sortedFiles = data.sort((a, b) =>
          b.created_at.localeCompare(a.created_at)
        );
        const latestFile = sortedFiles[0];
        const fileName = latestFile.name;
        const { data: urlData } = supabase.storage
          .from("profile-pics")
          .getPublicUrl(`${dentistryId}/${fileName}`);

        // Append a unique query parameter to bypass caching
        const publicUrlWithTimestamp = `${urlData?.publicUrl}?t=${new Date().getTime()}`;
        setProfilePicUrl(publicUrlWithTimestamp || null);
      } else {
        setProfilePicUrl(null); // No image, set to null (show placeholder)
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  }

  // Handle file selection and open crop modal
  function handleProfilePicUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !dentistryId) return;

    // Read the image file and get the data URL
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setShowCropModal(true);
    };
  }

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Function to create an image object
  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  async function getCroppedImg(
    imageSrc: string,
    pixelCrop: any
  ): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx?.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As a File
    return new Promise<File>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], "profile-pic.png", { type: "image/png" });
        resolve(file);
      }, "image/png");
    });
  }

  async function handleCropAndUpload() {
    try {
      setUploading(true);

      const croppedImageFile = await getCroppedImg(
        imageSrc!,
        croppedAreaPixels
      );

      // Delete existing profile pictures before uploading the new one
      await deleteProfilePicture();

      // Generate a unique filename with timestamp or UUID
      const uniqueFileName = `profile-pic-${Date.now()}.png`;
      // Alternatively, use UUID: const uniqueFileName = `profile-pic-${uuidv4()}.png`;

      // Upload the cropped image to the designated folder (dentistryId)
      const { error: uploadError } = await supabase.storage
        .from("profile-pics")
        .upload(`${dentistryId}/${uniqueFileName}`, croppedImageFile, {
          cacheControl: "3600",
          upsert: true, // Replace existing file if same name
        });

      if (uploadError) throw uploadError;

      // Fetch and update the profile pic URL after upload
      fetchProfilePicture();

      // Close the modal and clear selected image
      setShowCropModal(false);
      setImageSrc(null);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setUploading(false);
    }
  }

  // Delete the existing profile pictures
  async function deleteProfilePicture() {
    try {
      // List and delete all existing profile pictures
      const { data, error } = await supabase.storage
        .from("profile-pics")
        .list(dentistryId);

      if (error) throw error;

      if (data.length > 0) {
        const fileNames = data.map((file) => `${dentistryId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from("profile-pics")
          .remove(fileNames);

        if (deleteError) throw deleteError;

        setProfilePicUrl(null); // Clear the URL after deletion
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  }

  return (
    <div className="profile-pic-uploader text-center">
      <h2 className="text-lg font-semibold mb-3">Profile Picture</h2>

      <div className="relative group w-32 h-32 mx-auto">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt="Profile Picture"
              className="w-full h-full object-cover"
              defaultValue={"/placeholder.png"}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-gray-200"
              style={{
                backgroundImage: `url("/placeholder.png")`,
                backgroundSize: "cover",
              }}
            ></div>
          )}
        </div>

        {/* Hover Overlay */}
        <label
          className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-full z-10"
          htmlFor="profile-upload"
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.2)", // neutral-900 with 20% opacity
            opacity: "0",
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
        >
          <UploadSimple size={32} className="text-white" />
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleProfilePicUpload}
            disabled={uploading}
            className="hidden"
            ref={fileInputRef}
          />
        </label>

        {/* Trash Icon */}
        {profilePicUrl && (
          <button
            className="absolute top-1 left-1 bg-red-600 text-white p-0.5 rounded-full z-20"
            onClick={deleteProfilePicture}
          >
            <TrashSimple size={20} />
          </button>
        )}
      </div>

      {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}

      {/* Modal for cropping */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md relative w-96">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowCropModal(false);
                setImageSrc(null);
                // Reset the file input
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              &#10005; {/* This is the 'X' character */}
            </button>
            <div
              className="crop-container"
              style={{ position: "relative", width: "100%", height: "400px" }}
            >
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-4 flex flex-col items-center">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "#5046db" }}
              />
              <div className="mt-4 flex justify-between w-full">
                <button
                  onClick={() => {
                    setShowCropModal(false);
                    setImageSrc(null);
                    // Reset the file input
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="border border-neutral-400 rounded-full text-neutral-700 px-4 py-2 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropAndUpload}
                  className="bg-[#5046db] rounded-full text-white px-4 py-2 font-bold"
                  disabled={uploading}
                >
                  Crop and Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

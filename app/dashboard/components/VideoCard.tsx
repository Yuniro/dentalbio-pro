'use client'
import ConfirmMessage from "@/app/components/Modal/ConfirmMessagel";
import { ArrowSquareOut, CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react"

type VideoCardProps = VideoType & {
  onUpdate: (video: VideoType, image: null) => void;
  onEditItem: (id: string) => void;
  onDelete: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  onUpdate,
  onEditItem,
  onDelete,
  ...videoProps
}: VideoCardProps) => {
  const [isOpenConfirmMessage, setIsOpenConfirmMessage] = useState<boolean>(false);
  const [isActive, toggleIsActive] = useReducer((prevState) => !prevState, videoProps.enabled!);

  useEffect(() => {
    if (videoProps.enabled !== isActive) {
      const video = {
        id: videoProps.id, enabled: isActive
      }
      onUpdate(video, null);
    }
  }, [isActive]);

  const handleDelete = () => {
    onDelete(videoProps.id!);
  }

  return (
    <>
      <div className="w-full px-6 py-3 shadow rounded-[26px] flex items-center overflow-hidden gap-4 mb-4">
        {/* Caret Buttons */}
        <div className="cursor-pointer">
          <div><CaretUp /></div>
          <div><CaretDown /></div>
        </div>

        {/* Title and Content */}
        <div className="flex-grow text-[14px] overflow-hidden">
          {/* Title Row */}
          <div className="flex flex-1 items-center truncate gap-2">
            <div className="text-primary-1 font-bold truncate">{videoProps.title}</div>
            <PencilSimple
              size={18}
              className="cursor-pointer flex-shrink-0 hover:text-primary-1"
              onClick={() => onEditItem(videoProps.id!)}
            />
          </div>

          {/* Content Row */}
          {/* <div className="truncate" dangerouslySetInnerHTML={{__html: content!}} /> */}
        </div>

        {/* Trash Button */}
        <div className="flex items-center gap-2">
          <div onClick={() => setIsOpenConfirmMessage(true)}>
            <Trash size={20} className="cursor-pointer hover:text-red-700" />
          </div>

          {/* <Link
            href={videoProps.link!}
            target="_blank"
            className="w-8 h-8 p-0.5 hover:bg-neutral-100 hover:text-neutral-700 text-neutral-900 flex items-center justify-center rounded-md transition-all"
          >
            <ArrowSquareOut size={20} />
          </Link> */}

          <div className="form-check form-switch custom-form-check">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              // id={`flexSwitchCheckChecked-${link.link_id}`}
              checked={isActive}
              onChange={toggleIsActive}
            />
          </div>
        </div>
      </div>

      <ConfirmMessage
        description="Aure you sure you want to delete the video?"
        okText="Delete"
        isOpen={isOpenConfirmMessage}
        onClose={() => setIsOpenConfirmMessage(false)}
        onOk={handleDelete}
      />
    </>
  )
}

export default VideoCard;
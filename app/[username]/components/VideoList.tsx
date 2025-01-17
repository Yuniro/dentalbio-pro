'use client'
import React, { useEffect, useState } from "react";
import VideoItem from "./Basic/VideoItem";
import { useNavbar } from "@/app/components/NavbarContext";

type VideoListProps = {
  groupname: string;
  fetchedVideos: VideoType[];
}

const VideoList: React.FC<VideoListProps> = ({
  groupname,
  fetchedVideos,
}: VideoListProps) => {
  const { setNavItemState } = useNavbar();
  const [videos, setVideos] = useState<any[]>(fetchedVideos);

  useEffect(() => {
    if (videos.length > 0) {
      setNavItemState("Videos", true);
    }
  }, [videos]);

  return (
    <div className="text-center mb-4">
      {(videos.length > 0) &&
        <>
          <h1 className="section-heading-treatment text-[23px] md:text-[26px] font-semibold pb-8">{groupname}</h1>
          {videos.map((video, index) => (
            <VideoItem
              key={video.id}
              link={video.link}
              title={video.title}
            />
          ))}
        </>}
    </div>
  )
}

export default VideoList;
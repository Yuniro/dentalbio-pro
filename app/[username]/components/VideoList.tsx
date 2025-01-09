'use client'
import React, { useState } from "react";
import VideoItem from "./Basic/VideoItem";

type VideoListProps = {
  groupname: string;
  fetchedVideos: VideoType[];
}

const VideoList: React.FC<VideoListProps> = ({
  groupname,
  fetchedVideos,
}: VideoListProps) => {
  const [videos, setVideos] = useState<any[]>(fetchedVideos);

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
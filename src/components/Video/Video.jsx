import React from "react";
import { useRef, useState } from "react";
import './Video.css';

const Video = ({ videoUrls }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoElement = useRef(null);

    const playNextVideo = () => {
        if (currentVideoIndex < videoUrls.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
        } else {
            setCurrentVideoIndex(0);
        }
        videoElement.current.load();
    }

    return (
        <div className="video">
            <video
                width={230}
                height={411}
                className="video-player"
                controls
                ref={videoElement}
                onEnded={playNextVideo}
                autoPlay
            >
                <source src={videoUrls[currentVideoIndex]} type="video/mp4" />
            </video>
        </div>
    )
}

export default Video;
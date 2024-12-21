import React, { useState } from "react";

type Props = {
  imageSrc: string;
  altText: string;
  className?: string;
};

export default function TiltCard({ imageSrc, altText, className }: Props) {
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY, currentTarget } = e;
    const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = currentTarget;
    const xPos = clientX - offsetLeft - offsetWidth / 2;
    const yPos = clientY - offsetTop - offsetHeight / 2;

    const rotateX = (yPos / offsetHeight) * 20; // Adjust this value to control tilt intensity
    const rotateY = -(xPos / offsetWidth) * 20;

    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`,
      transition: "transform 0.1s ease-out",
      willChange: "transform",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.3s ease-out",
    });
  };

  return (
    <div
      className={`tilt-card relative w-full h-auto ${className}`}
      style={{ perspective: "1000px" }} // Perspective to create the 3D effect
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={imageSrc}
        alt={altText}
        className="w-full h-auto object-cover rounded-3xl"
        style={tiltStyle}
      />
    </div>
  );
}

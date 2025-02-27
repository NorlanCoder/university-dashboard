import React, { useState } from "react";
import { FiMaximize, FiMinimize } from "react-icons/fi";

const FullScreenToggle: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Activer le mode plein écran
  const enableFullScreen = () => {
    const elem = document.documentElement; // Cible l'élément racine
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen(); // Safari
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen(); // Internet Explorer/Edge
    }
    setIsFullScreen(true);
  };

  // Désactiver le mode plein écran
  const disableFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen(); // Safari
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen(); // Internet Explorer/Edge
    }
    setIsFullScreen(false);
  };

  // Basculer le mode plein écran
  const toggleFullScreen = () => {
    if (isFullScreen) {
      disableFullScreen();
    } else {
      enableFullScreen();
    }
  };

  return (
    <button
      onClick={toggleFullScreen}
      className="hidden lg:block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
      title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
    >
      {isFullScreen ? (
        <FiMinimize size={16} className="animate-fade-in" />
      ) : (
        <FiMaximize size={16} className="animate-fade-in" />
      )}
    </button>
  );
};


export default FullScreenToggle;

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip } from 'react-tooltip';
import { useTheme } from "@/components/context/ThemeContext";

interface CalculatorDropdownProps {
  onCalculMoyControle: () => void;
  onCalculMoyGeneral: () => void; 
}
 
const CalculatorDropdownEnd: React.FC<CalculatorDropdownProps> = ({
    onCalculMoyControle,
    onCalculMoyGeneral

}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);
  const { theme } = useTheme();

    // Détecter un clic en dehors du dropdown
    useEffect(() => {
      const handleClickOutside = (event:MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          closeDropdown();
        }
      };
  
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);
  


  return (
    <div className="relative " ref={dropdownRef}>
      {/* Bouton principal */}
      <a id="clickable"
          data-tooltip-id="calculMoy"
          data-tooltip-content="Calcul des Moyennes "
          data-tooltip-place="top"
      >
           <button
            style={{backgroundColor:theme.primaryColor, color:theme.textColor }} 
            className="rounded-full p-2 flex items-center justify-center shadow-lg"
            onClick={toggleDropdown}
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M3.5 12V4A1.5 1.5 0 0 1 5 2.5h6A1.5 1.5 0 0 1 12.5 4v8a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 12M5 15a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3zm.5-11a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2zm1 7a1 1 0 1 1-2 0a1 1 0 0 1 2 0M8 12a1 1 0 1 0 0-2a1 1 0 0 0 0 2m3.5-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-2a1 1 0 1 0 0-2a1 1 0 0 0 0 2M9 8a1 1 0 1 1-2 0a1 1 0 0 1 2 0m1.5 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/></svg>
          </button>
      </a>
    <Tooltip id="calculMoy" />
     
      {isOpen && (
        <motion.div
          className="absolute top-full mt-2 left-0 bg-white shadow-md rounded-lg p-3  z-10 w-56"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
       
          <button
            className="absolute -top-7  -right-1  p-1 text-lg dark:text-white dark:hover:text-gray-100 text-gray-900 hover:text-gray-700"
            onClick={ ()=>{ closeDropdown();}}
          >
            ✕
          </button>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                onCalculMoyControle();
                closeDropdown()
               }}
            >
              Moyenne Contrôle 
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                onCalculMoyGeneral();
                closeDropdown();
              }}
            >
              Moyenne Générale
            </Button>
      
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CalculatorDropdownEnd;

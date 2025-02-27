import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/context/ThemeContext";
import { Tooltip } from 'react-tooltip';

interface DropdownActionsProps {
  studentId: number;
  onAdd: (studentId: number) => void;
  onUpdate: (studentId: number) => void;
  onDelete: (studentId: number) => void;
}

const DropdownActions: React.FC<DropdownActionsProps> = ({
  studentId, 
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); 
  const { theme } = useTheme();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

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
    <div className="relative" ref={dropdownRef}>
      {/* Bouton des trois points */}
      <a id="clickable"
          data-tooltip-id="Actions"
          data-tooltip-content="Voir plus"
          data-tooltip-place="right"
      >
        <button
          onClick={toggleDropdown}
          className="p-1 rounded focus:outline-none"
          style={{backgroundColor:theme.primaryColor , color:theme.textColor }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        </button>
      </a>
      <Tooltip id="Actions" />
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1 mx-1">
            {/* Bouton Ajouter */}
            <button
              onClick={() => {
                onAdd(studentId);
                closeDropdown();
              }}
              className="block w-full px-4 py-2 text-[14px] rounded-md font-semibold text-gray-700"
              style={{ backgroundColor: "", color: "" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.primaryColor;
                e.currentTarget.style.color = theme.textColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.color = "";
              }}
            >
              Ajouter un contrôle
            </button>

            {/* Bouton Modifier */}
            <button
              onClick={() => {
                onUpdate(studentId);
                closeDropdown();
              }}
              className="block w-full px-4 py-2 text-[14px] rounded-md font-semibold text-gray-700"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.primaryColor;
                e.currentTarget.style.color = theme.textColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.color = "";
              }}
            >
              Modifier un contrôle
            </button>

            {/* Bouton Supprimer */}
            <button
              onClick={() => {
                onDelete(studentId);
                closeDropdown();
              }}
              className="block w-full px-4 py-2 text-[14px] rounded-md font-semibold text-gray-700"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.primaryColor;
                e.currentTarget.style.color = theme.textColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.color = "";
              }}
            >
              Supprimer un contrôle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownActions;

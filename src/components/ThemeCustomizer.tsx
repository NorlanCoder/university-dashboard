import React, { useState } from "react";
import { useTheme } from "../components/context/ThemeContext";
import { FiSettings, FiX, FiEdit2 } from "react-icons/fi";

const ThemeCustomizer = () => {
  const { theme, updateTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const suggestedColors = ["#4F46E5", "#16A34A", "#F59E0B"];

  const handleColorChange = (property: string, color: string) => {
    updateTheme(property, color);
  };

  // Évite la fermeture du panneau lors du clic à l'intérieur
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      {/* Bouton flottant */}
      <button 
       style={{ backgroundColor: theme.primaryColor}}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-10 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50 ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <FiSettings size={20}    className="animate-spin" />
      </button>
    
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        ></div>
      )}

      {/* Panneau de personnalisation */}
      <div   style={{
        backgroundColor: theme.sidebarColor }}
        className={`fixed right-0 w-80 top-0 bg-white dark:bg-gray-800 shadow-lg h-screen transition-transform duration-300 z-[9999] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={stopPropagation}
      >
        <div className="flex items-center justify-between border-b px-6 py-3">
          <h3  
          className="text-lg font-bold dark:text-gray-100 text-white">
            Customize Theme
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="">
  {/* Header Color */}
  <div className="mb-6">
    <label     style={{
        
        color: theme.textColor,
      }}
     className="px-4 my-4 block text-md text-gray-800 dark:text-gray-200 font-semibold bg-gray-600 dark:bg-gray-700  mb-2">
      Header Colors:
    </label>
    <div className="flex items-center mt-2 space-x-3 px-6 ">
      {suggestedColors.map((color) => (
        <button
          key={color}
          onClick={() => handleColorChange("headerColor", color)}
          style={{
            backgroundColor: color,
            boxShadow:
              theme.headerColor === color
                ? "0 0 0 3px rgba(59, 130, 246, 0.5)"
                : "none",
          }}
          className="w-8 h-8 rounded-full border border-gray-300 transition"
        />
      ))}
      <div className="relative">
        <input
          type="color"
          value={theme.headerColor}
          onChange={(e) =>
            handleColorChange("headerColor", e.target.value)
          }
          className="absolute w-10 h-10 opacity-0 cursor-pointer"
        />
        <div
          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center"
          style={{ backgroundColor: theme.headerColor }}
        >
          <FiEdit2 className="text-gray-600" />
        </div>
      </div>
    </div>
  </div>

  {/* Sidebar Color */}
  <div className="mb-6">
    <label   style={{

        color: theme.textColor,
      }}
     className="px-4 my-4 block text-md text-gray-800 dark:text-gray-200 font-semibold bg-gray-600 dark:bg-gray-700  mb-2">
      Sidebar Color:
    </label>
    <div className="flex items-center mt-2 space-x-3 px-6">
      {suggestedColors.map((color) => (
        <button
          key={color}
          onClick={() => handleColorChange("sidebarColor", color)}
          style={{
            backgroundColor: color,
            boxShadow:
              theme.sidebarColor === color
                ? "0 0 0 3px rgba(59, 130, 246, 0.5)"
                : "none",
          }}
          className="w-8 h-8 rounded-full border border-gray-300 transition"
        />
      ))}
      <div className="relative">
        <input
          type="color"
          value={theme.sidebarColor}
          onChange={(e) =>
            handleColorChange("sidebarColor", e.target.value)
          }
          className="absolute w-10 h-10 opacity-0 cursor-pointer"
        />
        <div
          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center"
          style={{ backgroundColor: theme.sidebarColor }}
        >
          <FiEdit2 className="text-gray-600" />
        </div>
      </div>
    </div>
  </div>

  {/* Button Color */}
  <div className="mb-6">
    <label   style={{
      fontFamily: theme.font,
        color: theme.textColor,
      }}
    className="  px-4 my-4 block text-md text-gray-800 dark:text-gray-200 font-semibold bg-gray-600 dark:bg-gray-700 mb-2">
      Primary Color:
    </label>
    <div className="flex items-center mt-2 space-x-3 px-6 ">
      {suggestedColors.map((color) => (
        <button
          key={color}
          onClick={() => handleColorChange("primaryColor", color)}
          style={{
            backgroundColor: color,
            boxShadow:
              theme.primaryColor === color
                ? "0 0 0 3px rgba(59, 130, 246, 0.5)"
                : "none",
          }}
          className="w-8 h-8 rounded-full border border-gray-300 transition"
        />
      ))}
      <div className="relative">
        <input
          type="color"
          value={theme.primaryColor}
          onChange={(e) =>
            handleColorChange("primaryColor", e.target.value)
          }
          className="absolute w-10 h-10 opacity-0 cursor-pointer"
        />
        <div
          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <FiEdit2 className="text-gray-600" />
        </div>
      </div>
    </div>
  </div>

  {/* Text Color */}
  <div className="mb-6">
            <label   style={{
       
        color: theme.textColor,
      }}
             className="px-4 my-4 block text-md text-gray-800 dark:text-gray-200 font-semibold bg-gray-600 dark:bg-gray-700  mb-2">Text Color</label>
            <div className="flex items-center mt-2 space-x-3 px-6">
              {["#000000", "#FFFFFF", "#4B5563"].map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange("textColor", color)}
                  style={{
                    backgroundColor: color,
                    boxShadow: theme.textColor === color ? "0 0 0 3px rgba(59, 130, 246, 0.5)" : "none",
                  }}
                  className="w-8 h-8 rounded-full border border-gray-300 transition"
                />
              ))}
            </div>
          </div>

          <div className="mb-6 ">
<label   style={{ color: theme.textColor,
}} className="px-4 my-4 block text-md text-gray-800 dark:text-gray-200 font-semibold bg-gray-600 dark:bg-gray-700  mb-2 ">
Font Family
</label>
          <div className=" relative z-20 inline-block pl-4">
            <select
         value={theme.font}
         onChange={(e) => updateTheme("font", e.target.value)}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
        <option value="Inter, sans-serif">Inter</option>
    <option value="Roboto, sans-serif">Roboto</option>
    <option value="Poppins, sans-serif">Poppins</option>
    <option value="Montserrat, sans-serif">Montserrat</option>
    <option value="Arial, sans-serif">Arial</option>
            </select>
            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
          </div>
          


  {/* <div className="mb-6 ">

  <div className="flex flex-col items-center">
  <select
    value={theme.font}
    onChange={(e) => updateTheme("font", e.target.value)}
    className="w-3/4 mt-2 rounded border border-gray-300 dark:border-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  >

  </select>
</div>

</div> */}


  {/* Reset Button */}
  <div className="mt-10 px-6">
    <button
      onClick={() => {
        handleColorChange("headerColor", "#ffffff");
        handleColorChange("sidebarColor", "#1f2937");
        handleColorChange("primaryColor", "#333A42");
        handleColorChange("textColor", "#ffffff");
      }}
      className="w-full py-2 rounded-lg shadow-md transition  bg-red-500 font-semibold text-white"
      style={{
        backgroundColor: theme.primaryColor,
        color: theme.textColor,
      }}
    >
      Reset to Default
    </button>
  </div>
</div>

      </div>
    </>
  );
};

export default ThemeCustomizer;

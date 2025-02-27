import React, { useState, useEffect } from 'react';

interface Slide {
  image: string;
  text: string;
}

const slides: Slide[] = [
  {
    image: '/src/images/brand/Scrum board-bro.png',
    text: 'Gérez efficacement les écoles et facultés avec notre solution SaaS.',
  },
  {
    image: '/src/images/brand/Seminar-pana.png',
    text: 'Simplifiez la gestion des étudiants et des enseignants.',
  },
  {
    image: '/src/images/brand/Metrics-pana.png',
    text: 'Analysez les performances académiques avec des tableaux de bord avancés.',
  },
];

const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-full bg-gray-50 flex flex-col items-center">
      {/* Image Section */}
      <div className="relative h-80 w-full overflow-hidden rounded-lg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.text}
              className=" mt-16 object-cover w-[80%] h-[80%] rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Text Section */}
      <div className="mt-4 text-center px-12">
        <p className="text-lg font-semibold text-gray-700">{slides[currentIndex].text}</p>
      </div>

      {/* Navigation Dots */}
      <div className="mt-8 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex
                ? 'bg-blue-500'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          ></button>
        ))}
      </div>

   
    </div>
  );
};

export default ImageSlider;

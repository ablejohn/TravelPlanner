import React from "react";

const Card = ({ children, className, ...props }) => (
  <div
    className={`bg-white rounded-md shadow-sm hover:shadow ${className}`}
    {...props}
  >
    {children}
  </div>
);

const PopularDestinations = () => {
  const cities = [
    {
      id: 1,
      name: "Paris, France",
      description: "The City of Light",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      description: "A blend of modern and traditional",
      imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
    },
    {
      id: 3,
      name: "New York City, USA",
      description: "The Big Apple",
      imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    },
    {
      id: 4,
      name: "Barcelona, Spain",
      description: "City of Gaudi",
      imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
    },
    {
      id: 5,
      name: "Dubai, UAE",
      description: "City of the Future",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    },
    {
      id: 6,
      name: "Sydney, Australia",
      description: "Harbor City",
      imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
    },
  ];

  return (
    <div className="bg-white py-4 px-4">
      <div className="max-w-1xl mx-auto">
        <h1 className="text-xl font-medium text-gray-900 mb-3">
          Popular Destinations
        </h1>

        <div className="grid grid-cols-3 gap-2">
          {cities.map((city) => (
            <Card key={city.id} className="overflow-hidden">
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <h2 className="text-xs font-medium text-gray-800 truncate">
                  {city.name}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {city.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDestinations;

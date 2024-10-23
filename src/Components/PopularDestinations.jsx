import React from "react";
const Card = ({ children, className, ...props }) => (
  <div className={`rounded-lg shadow-md ${className}`} {...props}>
    {children}
  </div>
);

const PopularDestinations = () => {
  const cities = [
    {
      id: 1,
      name: "Paris, France",
      description: "The City of Light",
      imageUrl: "/api/placeholder/800/500",
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      description: "A blend of modern and traditional",
      imageUrl: "/api/placeholder/800/500",
    },
    {
      id: 3,
      name: "New York City, USA",
      description: "The Big Apple",
      imageUrl: "/api/placeholder/800/500",
    },
    {
      id: 4,
      name: "Barcelona, Spain",
      description: "City of Gaudi",
      imageUrl: "/api/placeholder/800/500",
    },
    {
      id: 5,
      name: "Dubai, UAE",
      description: "City of the Future",
      imageUrl: "/api/placeholder/800/500",
    },
    {
      id: 6,
      name: "Sydney, Australia",
      description: "Harbor City",
      imageUrl: "/api/placeholder/800/500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Popular Destinations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <Card
            key={city.id}
            className="overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <img
              src={city.imageUrl}
              alt={city.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{city.name}</h2>
              <p className="text-gray-600">{city.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;

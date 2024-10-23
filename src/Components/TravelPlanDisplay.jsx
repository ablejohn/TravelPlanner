// src/Components/TravelPlanDisplay.jsx
import React from "react";

const TravelPlanDisplay = ({ travelData }) => {
  // Parse the raw text into sections
  const parseContent = (rawText) => {
    const sections = {
      attractions: [],
      accommodation: [],
      food: [],
      transportation: [],
      budget: [],
    };

    let currentSection = null;

    rawText.split("\n").forEach((line) => {
      if (line.includes("KEY ATTRACTIONS:")) {
        currentSection = "attractions";
      } else if (line.includes("ACCOMMODATION:")) {
        currentSection = "accommodation";
      } else if (line.includes("FOOD RECOMMENDATIONS:")) {
        currentSection = "food";
      } else if (line.includes("TRANSPORTATION:")) {
        currentSection = "transportation";
      } else if (line.includes("BUDGET BREAKDOWN:")) {
        currentSection = "budget";
      } else if (line.trim() && currentSection) {
        sections[currentSection].push(line.trim());
      }
    });

    return sections;
  };

  const sections = parseContent(travelData);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Key Attractions
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {sections.attractions.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Accommodation
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {sections.accommodation.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Food Recommendations
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {sections.food.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Transportation
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {sections.transportation.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Budget Breakdown
        </h2>
        <ul className="list-none space-y-2">
          {sections.budget.map((item, index) => (
            <li key={index} className="text-gray-700 font-medium">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default TravelPlanDisplay;

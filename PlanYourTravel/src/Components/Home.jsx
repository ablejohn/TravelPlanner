import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import "./Custom.css";

const Home = () => {
  const { register, handleSubmit } = useForm();
  const [tripPlan, setTripPlan] = useState(null);

  const onSubmit = (data) => {
    // Use the user's input data to generate a trip plan
    const tripPlan = generateTripPlan(data);
    setTripPlan(tripPlan);
  };

  const generateTripPlan = (formData) => {
    // Implement logic to generate a trip plan based on the user's input
    // This could involve calling external APIs, accessing travel databases, etc.
    // For now, let's return a simple sample trip plan using the form data
    return {
      destinations: [formData.location],
      duration: formData.duration,
      cost: formData.estimatedCost,
    };
  };

  return (
    <div className="travel-planner-container">
      <h2 className="mb-4">Travel Planner</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="form-group">
          <label htmlFor="location">Destination:</label>
          <input
            type="text"
            id="location"
            {...register("location")}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="duration">Duration (days):</label>
          <input
            type="number"
            id="duration"
            {...register("duration")}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="estimatedCost">Estimated Cost ($):</label>
          <input
            type="number"
            id="estimatedCost"
            {...register("estimatedCost")}
            className="form-control"
          />
        </div>
        
        <button type="submit" className="btn btn-primary mt-3">
          Generate Trip Plan
        </button>
      </form>

      {tripPlan && (
        <div className="card">
          <div className="card-header">Your Trip Plan</div>
          <div className="card-body">
            <p>Destinations: {tripPlan.destinations.join(", ")}</p>
            <p>Duration: {tripPlan.duration} days</p>
            <p>Estimated Cost: ${tripPlan.cost}</p>
            <Button />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
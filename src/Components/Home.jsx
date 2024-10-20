import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import "./Custom.css";

const Home = () => {
  const { register, handleSubmit } = useForm();
  const [tripPlan, setTripPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const generatedPlan = await planTravel(
        data.location,
        data.duration,
        data.estimatedCost
      );
      setTripPlan({
        destinations: [data.location],
        duration: data.duration,
        cost: data.estimatedCost,
        aiGeneratedPlan: generatedPlan,
      });
    } catch (error) {
      console.error("Failed to generate trip plan:", error);
      // You might want to show an error message to the user here
    }
    setIsLoading(false);
  };

  return (
    <div className="travel-planner-container">
      <h2 className="mb-4">Plan Your Travel</h2>
      <h5 className="mb-4">Please Fill in your Information</h5>
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

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={isLoading}
        >
          {isLoading ? "Generating Trip Plan..." : "Generate Trip Plan"}
        </button>
      </form>

      {tripPlan && (
        <div className="card">
          <div className="card-header">Your Trip Plan</div>
          <div className="card-body">
            <p>Destinations: {tripPlan.destinations.join(", ")}</p>
            <p>Duration: {tripPlan.duration} days</p>
            <p>Estimated Cost: ${tripPlan.cost}</p>
            <h4>AI-Generated Plan:</h4>
            <pre>{tripPlan.aiGeneratedPlan}</pre>
            <Button />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

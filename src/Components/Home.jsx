import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { planTravel } from "./travelPlannerAPI";
import "./Custom.css";

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [tripPlan, setTripPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate payment process
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      if (error.response && error.response.status === 429) {
        setError(
          "We're experiencing high demand. Please try again in a few minutes."
        );
      } else if (error.message === "Could not generate a travel plan.") {
        setError(
          "Unable to generate a travel plan at this time. Please try again later."
        );
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="travel-planner-container">
      <h2 className="mb-4">Plan Your Travel</h2>
      <h5 className="mb-4">Please Fill in your Information</h5>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <input
          {...register("location", { required: "Location is required" })}
          placeholder="Location"
          className="form-control mb-2"
        />
        {errors.location && (
          <span className="text-danger">{errors.location.message}</span>
        )}

        <input
          type="number"
          {...register("duration", {
            required: "Duration is required",
            min: 1,
          })}
          placeholder="Duration (days)"
          className="form-control mb-2"
        />
        {errors.duration && (
          <span className="text-danger">{errors.duration.message}</span>
        )}

        <input
          type="number"
          {...register("estimatedCost", {
            required: "Estimated cost is required",
            min: 0,
          })}
          placeholder="Estimated Cost ($)"
          className="form-control mb-2"
        />
        {errors.estimatedCost && (
          <span className="text-danger">{errors.estimatedCost.message}</span>
        )}

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit and Pay"}
        </button>
      </form>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {tripPlan && (
        <div className="card">
          <div className="card-header">Your Trip Plan</div>
          <div className="card-body">
            <p>Destinations: {tripPlan.destinations.join(", ")}</p>
            <p>Duration: {tripPlan.duration} days</p>
            <p>Estimated Cost: ${tripPlan.cost}</p>
            <h4>AI-Generated Plan:</h4>
            <pre>{tripPlan.aiGeneratedPlan}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

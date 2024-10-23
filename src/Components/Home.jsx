import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { planTravel } from "../services/travelPlannerAPI";
import TravelPlanDisplay from "./TravelPlanDisplay";
import "./Custom.css";

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [tripPlan, setTripPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setTripPlan(null);

    try {
      const generatedPlan = await planTravel(
        data.location,
        Number(data.duration),
        Number(data.estimatedCost)
      );

      // Structure the trip plan data
      setTripPlan({
        destinations: [data.location],
        duration: data.duration,
        cost: data.estimatedCost,
        aiGeneratedPlan: generatedPlan,
      });
    } catch (err) {
      console.error("Failed to generate trip plan:", err);
      const errorMessage = err.message.toLowerCase();

      if (errorMessage.includes("api key")) {
        setError("Authentication error. Please check your API configuration.");
      } else if (errorMessage.includes("service unavailable")) {
        setError("Service is temporarily unavailable. Please try again later.");
      } else if (err.response?.status === 429) {
        setError("Too many requests. Please wait a moment and try again.");
      } else {
        setError(
          err.message || "Failed to generate travel plan. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="travel-planner-container p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Plan Your Travel</h2>
      <h5 className="text-gray-600 text-center mb-6">
        Enter your travel details below
      </h5>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-group">
          <input
            {...register("location", {
              required: "Location is required",
              minLength: {
                value: 2,
                message: "Location must be at least 2 characters",
              },
            })}
            placeholder="Enter destination (e.g., Paris, France)"
            className="form-control"
            disabled={isLoading}
          />
          {errors.location && (
            <span className="text-red-500 text-sm">
              {errors.location.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <input
            type="number"
            {...register("duration", {
              required: "Duration is required",
              min: { value: 1, message: "Minimum duration is 1 day" },
              max: { value: 30, message: "Maximum duration is 30 days" },
            })}
            placeholder="Duration (days)"
            className="form-control"
            disabled={isLoading}
          />
          {errors.duration && (
            <span className="text-red-500 text-sm">
              {errors.duration.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <input
            type="number"
            {...register("estimatedCost", {
              required: "Budget is required",
              min: { value: 50, message: "Minimum budget is $50" },
            })}
            placeholder="Budget in USD ($)"
            className="form-control"
            disabled={isLoading}
          />
          {errors.estimatedCost && (
            <span className="text-red-500 text-sm">
              {errors.estimatedCost.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading || isSubmitting}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⌛</span>
              Generating Plan...
            </span>
          ) : (
            "Generate Travel Plan"
          )}
        </button>
      </form>

      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      )}

      {tripPlan && !error && (
        <div className="card mt-6">
          <div className="card-header bg-blue-50">
            <h3 className="text-xl font-bold">Your Travel Plan</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <strong>Destination</strong>
                <p>{tripPlan.destinations.join(", ")}</p>
              </div>
              <div>
                <strong>Duration</strong>
                <p>{tripPlan.duration} days</p>
              </div>
              <div>
                <strong>Budget</strong>
                <p>${tripPlan.cost}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-bold mb-2">Detailed Itinerary:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <TravelPlanDisplay travelData={tripPlan.aiGeneratedPlan} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

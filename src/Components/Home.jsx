import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { planTravel } from "./travelPlannerAPI";
import "./Custom.css";

const Home = () => {
  const { register, handleSubmit, reset } = useForm();
  const [tripPlan, setTripPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setFormData(data);
    setError(null);
    setIsLoading(false);
  };

  const handlePaymentVerified = async () => {
    if (!formData) return;

    setIsLoading(true);
    setError(null);
    try {
      const generatedPlan = await planTravel(
        formData.location,
        formData.duration,
        formData.estimatedCost
      );
      setTripPlan({
        destinations: [formData.location],
        duration: formData.duration,
        cost: formData.estimatedCost,
        aiGeneratedPlan: generatedPlan,
      });
    } catch (error) {
      console.error("Failed to generate trip plan:", error);
      setError("Failed to generate trip plan. Please try again later.");
    }
    setIsLoading(false);
  };

  return (
    <div className="travel-planner-container">
      <h2 className="mb-4">Plan Your Travel</h2>
      <h5 className="mb-4">Please Fill in your Information</h5>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <input
          {...register("location", { required: true })}
          placeholder="Location"
          className="form-control mb-2"
        />
        <input
          type="number"
          {...register("duration", { required: true })}
          placeholder="Duration (days)"
          className="form-control mb-2"
        />
        <input
          type="number"
          {...register("estimatedCost", { required: true })}
          placeholder="Estimated Cost ($)"
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      {formData && !tripPlan && (
        <Button onPaymentVerified={handlePaymentVerified} />
      )}

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

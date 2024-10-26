import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";
import Button from "./Button";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "100%",
    margin: "0 auto",
    overflowX: "hidden",
  },
  header: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
    color: "#0a4275",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "Bold",
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  summaryItem: {
    textAlign: "center",
    padding: "10px",
  },
  summaryLabel: {
    fontWeight: "bold",
    fontSize: "clamp(1.2rem, 3vw, 2rem)",
    color: "#34495e",
    marginBottom: "5px",
  },
  summaryValue: {
    color: "#7f8c8d",
    fontSize: "clamp(1rem, 2.5vw, 1.8rem)",
    wordBreak: "break-word",
  },
  sectionsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  sectionHeader: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
    paddingBottom: "8px",
    borderBottom: "2px solid #3498db",
  },
  content: {
    color: "#555",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    fontSize: "0.95rem",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginTop: "25px",
    padding: "0 15px",
    "@media (min-width: 768px)": {
      flexDirection: "row",
      justifyContent: "center",
    },
  },
};

const TravelPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [navigationAttempted, setNavigationAttempted] = useState(false);
  const tripPlan = location.state?.tripPlan;

  useEffect(() => {
    // Reset navigation attempt state when component mounts
    setNavigationAttempted(false);
  }, []);

  const handlePaymentVerified = () => {
    try {
      setNavigationAttempted(true);
      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        navigate("/print", {
          state: { tripPlan },
          replace: true, // Use replace to avoid history stack issues
        });
      }, 100);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation if the first attempt fails
      if (!navigationAttempted) {
        window.location.href = "/print";
      }
    }
  };

  if (!tripPlan) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>No travel plan found</h2>
          <p>Please generate a travel plan first.</p>
          <MDBBtn onClick={() => navigate("/")}>Back to Home</MDBBtn>
        </div>
      </div>
    );
  }

  const { destinations, duration, cost, aiGeneratedPlan } = tripPlan;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>YOUR TRAVEL PLAN</h1>
        <div style={styles.summary}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Destination</div>
            <div style={styles.summaryValue}>{destinations.join(", ")}</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Duration</div>
            <div style={styles.summaryValue}>{duration} days</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}>Budget</div>
            <div style={styles.summaryValue}>${cost}</div>
          </div>
        </div>
      </div>

      <div style={styles.sectionsContainer}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>Key Attractions</div>
          <div style={styles.content}>{aiGeneratedPlan.attractions}</div>
        </div>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>Accommodation</div>
          <div style={styles.content}>{aiGeneratedPlan.accommodation}</div>
        </div>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>Food Recommendations</div>
          <div style={styles.content}>{aiGeneratedPlan.food}</div>
        </div>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>Transportation</div>
          <div style={styles.content}>{aiGeneratedPlan.transportation}</div>
        </div>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>Budget Breakdown</div>
          <div style={styles.content}>{aiGeneratedPlan.budget}</div>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <MDBBtn
          onClick={() => navigate("/")}
          style={{ width: "100%", maxWidth: "300px" }}
        >
          Create New Plan
        </MDBBtn>
        {!showPaymentButton ? (
          <MDBBtn
            onClick={() => setShowPaymentButton(true)}
            className="custom-btn"
            style={{ width: "100%", maxWidth: "300px" }}
          >
            Pay to Save Travel Plan
          </MDBBtn>
        ) : (
          <Button onPaymentVerified={handlePaymentVerified} />
        )}
      </div>
    </div>
  );
};

export default TravelPlanPage;

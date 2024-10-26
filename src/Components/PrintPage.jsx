import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "100%",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
    color: "#0a4275",
    marginBottom: "15px",
  },
  content: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "10px",
    paddingBottom: "5px",
    borderBottom: "2px solid #3498db",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },
  printOnly: {
    display: "none",
    "@media print": {
      display: "block",
    },
  },
  noPrint: {
    "@media print": {
      display: "none",
    },
  },
};

const PrintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tripPlan = location.state?.tripPlan;

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Travel Itinerary</h1>
        <p>
          Destination: {destinations.join(", ")} | Duration: {duration} days |
          Budget: ${cost}
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Key Attractions</h2>
          <p>{aiGeneratedPlan.attractions}</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Accommodation</h2>
          <p>{aiGeneratedPlan.accommodation}</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Food Recommendations</h2>
          <p>{aiGeneratedPlan.food}</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Transportation</h2>
          <p>{aiGeneratedPlan.transportation}</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Budget Breakdown</h2>
          <p>{aiGeneratedPlan.budget}</p>
        </div>
      </div>

      <div style={styles.buttonContainer} className="no-print">
        <MDBBtn onClick={handlePrint}>Print Itinerary</MDBBtn>
        <MDBBtn onClick={() => navigate("/")}>Back to Home</MDBBtn>
      </div>
    </div>
  );
};

export default PrintPage;

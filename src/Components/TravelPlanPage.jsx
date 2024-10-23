import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "20px",
    textAlign: "center",
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  summaryItem: {
    textAlign: "center",
    padding: "15px",
  },
  summaryLabel: {
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: "5px",
  },
  summaryValue: {
    color: "#7f8c8d",
    fontSize: "1.1rem",
  },
  sectionsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    marginTop: "30px",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  sectionHeader: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "2px solid #3498db",
  },
  content: {
    color: "#555",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    gap: "15px",
  },
};

const TravelPlanPage = () => {
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Travel Plan</h1>
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
        <MDBBtn onClick={() => navigate("/")}>Create New Plan</MDBBtn>
        <MDBBtn onClick={() => window.print()} color="success">
          Save as PDF
        </MDBBtn>
      </div>
    </div>
  );
};

export default TravelPlanPage;

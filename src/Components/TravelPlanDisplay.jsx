import React from "react";

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    padding: "20px",
  },
  sectionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    minWidth: "300px",
    maxWidth: "400px",
    flex: "1 1 300px",
  },
  header: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
    borderBottom: "2px solid #4CAF50",
    paddingBottom: "5px",
  },
  content: {
    color: "#555",
    whiteSpace: "pre-wrap", // Preserve line breaks from API response
  },
};

const TravelPlanDisplay = ({ travelData }) => {
  return (
    <div style={styles.container}>
      <div style={styles.sectionCard}>
        <div style={styles.header}>Key Attractions</div>
        <div style={styles.content}>{travelData.attractions}</div>
      </div>

      <div style={styles.sectionCard}>
        <div style={styles.header}>Accommodation</div>
        <div style={styles.content}>{travelData.accommodation}</div>
      </div>

      <div style={styles.sectionCard}>
        <div style={styles.header}>Food Recommendations</div>
        <div style={styles.content}>{travelData.food}</div>
      </div>

      <div style={styles.sectionCard}>
        <div style={styles.header}>Transportation</div>
        <div style={styles.content}>{travelData.transportation}</div>
      </div>

      <div style={styles.sectionCard}>
        <div style={styles.header}>Budget Breakdown</div>
        <div style={styles.content}>{travelData.budget}</div>
      </div>
    </div>
  );
};

export default TravelPlanDisplay;

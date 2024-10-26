import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Components/Home";
import TravelPlanPage from "./Components/TravelPlanPage";

import ButtonPage from "./Components/Button"; // Import the Button component
import AirplaneLoader from "./Lottiefiles/AirplaneLoader.json";

import Lottie from "lottie-react";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Lottie
          animationData={AirplaneLoader}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

  return (
    <Router>
      <div>
        <NavBar />
        <div className="container my-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/travel-plan" element={<TravelPlanPage />} />

            <Route path="/buy" element={<ButtonPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

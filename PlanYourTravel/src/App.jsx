import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Components/Home";
import AirplaneLoader from "./Lottiefiles/AirplaneLoader.json";
import Lottie from "lottie-react";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading time, adjust as needed

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
    <div>
      <NavBar />
      <div className="container my-5">
        <Home />
      </div>
      <Footer />
    </div>
  );
};

export default App;

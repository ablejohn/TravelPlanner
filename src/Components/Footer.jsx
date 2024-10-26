import ButtonPage from "./Button"; // Import the Button component
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./Custom.css";
const Footer = () => {
  return (
    <section>
      {/* Footer */}
      <footer
        className="text-center text-white"
        style={{ backgroundColor: "#0a4275" }}
      >
        <div className="container p-4 pb-0">
          {/* Section: CTA */}
          <section>
            <p
              className="d-flex justify-content-center align-items-center"
              style={{ whiteSpace: "nowrap" }}
            >
              <span className="me-3">Wanna buy me a coffee?</span>
              <ButtonPage />
            </p>
          </section>
        </div>

        {/* Copyright */}
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          © 2024 Copyright:{" "}
          <a
            className="text-white"
            href="https://www.linkedin.com/in/john-abe-601247236/"
          >
            Mr ableJohn
          </a>
        </div>
        {/* Copyright */}
      </footer>
      {/* Footer */}
    </section>
  );
};

export default Footer;

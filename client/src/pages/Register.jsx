import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/register.css";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Email validation function
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
};

// Password validation function
const validatePassword = (password) => {
  const re = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return re.test(password);
};

function Register() {
  const navigate = useNavigate();

  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [error, setError] = useState(""); // Add error state

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(""); // Clear error message before making the request

    // Validate email format
    if (!validateEmail(info.email)) {
      setError("Invalid email format");
      return;
    }

    // Validate password format
    if (!validatePassword(info.password)) {
      setError("Password must be at least 8 characters long and include a number, a symbol, and one uppercase letter");
      return;
    }

    if (file) {
      const data = new FormData();

      data.append("file", file);
      data.append("upload_preset", "mesgna");

      try {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/mesgna/image/upload",
          data,
          { withCredentials: false }
        );

        const { url } = uploadRes.data;

        const newUser = {
          ...info,
          profilePicture: url,
        };

        await axios.post("http://localhost:5500/api/users/register", newUser, {
          withCredentials: false,
        });

        navigate("/login");
      } catch (err) {
        console.log(err);
        setError("Failed to register. Please try again."); // Set error message
      }
    } else {
      try {
        await axios.post("http://localhost:5500/api/users/register", info, {
          withCredentials: false,
        });

        navigate("/login");
      } catch (err) {
        console.log(err);
        setError("Failed to register. Please try again."); // Set error message
      }
    }
  };

  return (
    <div className="register">
      <Navbar />
      <div className="registerCard">
        <div className="center">
          <h1>Join Us</h1>

          {error && <div className="error">{error}</div>} {/* Display error message */}

          <form>
            <div className="image">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
                height="100px"
              />

              <div className="txt_field_img">
                <label htmlFor="file">
                  Image
                  <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="formInput">
              <div className="txt_field">
                <input
                  type="text"
                  placeholder="username"
                  name="username"
                  onChange={handleChange}
                  id="username"
                  required
                />
              </div>
              <div className="txt_field">
                <input
                  type="email"
                  placeholder="email"
                  name="email"
                  onChange={handleChange}
                  id="email"
                  required
                />
              </div>
              <div className="txt_field">
                <input
                  type="password"
                  placeholder="password"
                  name="password"
                  onChange={handleChange}
                  id="password"
                  required
                />
              </div>
            </div>
            <div className="login_button">
              <button className="button" onClick={handleClick}>
                Register
              </button>
            </div>
            <div className="signup_link">
              <p>
                Already Registered?
                <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

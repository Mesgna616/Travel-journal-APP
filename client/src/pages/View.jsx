import React, {  useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  faCalendar,
  faMapLocationDot,
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/view.css";
import axios from "axios";

const View = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  // State to handle fetched data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slideNumber, setSlideNumber] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5500/api/entries/${id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result.photos)
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5500/api/entries/${data._id}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    let size = data.photos.length;
    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? size - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === size - 1 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="view">
      <Navbar />
      <div className="postPageBG">
        <div className="upperContent">
          <h1>{data.title}</h1>
          <p>
            <FontAwesomeIcon className="icon" icon={faCalendar} />
            {data.date}
          </p>
          <p>
            <FontAwesomeIcon className="icon" icon={faMapLocationDot} />
            {data.location}
          </p>
        </div>
      </div>

      <div className="postContainer">
        <div className="leftContainer">
          {data.photos && data.photos.length > 0 ? (
            <div className="images">
              <img src={data.photos[slideNumber]} height="300px" alt="" />
              {data.photos.length > 1 && (
                <div className="arrows">
                  <FontAwesomeIcon
                    icon={faCircleArrowLeft}
                    className="arrow"
                    onClick={() => handleMove("l")}
                  />
                  <FontAwesomeIcon
                    icon={faCircleArrowRight}
                    className="arrow"
                    onClick={() => handleMove("r")}
                  />
                </div>
              )}
            </div>
          ) : (
            "No Images"
          )}
        </div>

        <div className="rightContainer">
          <p>" {data.text} "</p>
          <button
            className="del_button"
            style={{ marginRight: "5px" }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default View;

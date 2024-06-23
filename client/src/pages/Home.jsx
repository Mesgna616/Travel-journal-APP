import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuthContext } from "../authContext";
import "../styles/home.css";
import Card from "../components/Card";
const Home = () => {
  const [query, setQuery] = useState("");
  const { user } = useContext(AuthContext);

  // State to handle fetched data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("User:", user); // Debugging user object
    if (user && user._id) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:5500/api/entries/author/${user._id}`,
            {
              credentials: "include",
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result = await response.json();
          setData(result);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user]); // Fetch data only when user is available

  useEffect(() => {
    console.log("Fetched data:", data);
  }, [data]);

  const keys = ["title", "location", "date"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some(
        (key) =>
          item[key] && item[key].toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="search">
        <div className="searchBar">
          <h2>Explore</h2>
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search places or dates"
              onChange={(e) => setQuery(e.target.value)}
            />
            <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
          </div>
        </div>
      </div>

      <div className="searchedPosts">
        {loading ? (
          <div
            className="p"
            style={{
              color: "white",
              fontFamily: "'Kaushan Script', cursive",
            }}
          >
            Loading...
          </div>
        ) : (
          search(data).map((item) => (
            <Card
              key={item._id}
              _id={item._id}
              photos={item.photos}
              title={item.title}
              date={item.date}
              location={item.location}
              text={item.text}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

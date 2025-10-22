import { useState } from "react";
import "./App.css";

const ACCESS_KEY = import.meta.env.VITE_DOG_API_KEY;

function App() {
  const [currentDog, setCurrentDog] = useState(null); // stores the current random dog
  const [banList, setBanList] = useState([]); // stores banned attribute values

  // 🔁 Fetches a random dog while avoiding banned attributes
  const fetchDog = async () => {
    const url = "https://api.thedogapi.com/v1/breeds";
    let newDog = null;
  
    try {
      // fetch all breeds
      const response = await fetch(url, {
        headers: { "x-api-key": ACCESS_KEY },
      });
      const data = await response.json();
  
      // pick a random breed from the list
      do {
        const randomBreed = data[Math.floor(Math.random() * data.length)];
        newDog = randomBreed;
      } while (
        banList.includes(newDog.name) ||
        banList.includes(newDog.origin)
      );
  
      setCurrentDog(newDog);
    } catch (error) {
      console.error("Error fetching breed:", error);
      alert("Failed to fetch breed info. Please try again!");
    }
  };
  

  // 🚫 Toggles an attribute in or out of the ban list
  const toggleBan = (value) => {
    if (!value) return; // guard against empty values
    setBanList((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="app-container">
      <h1>Veni Vici 🐾 — Discover New Dogs</h1>
      <button className="discover-button" onClick={fetchDog}>
        Discover a Dog
      </button>

      {/* 🐶 Display current dog */}
      {currentDog ? (
        <div className="dog-card">
          {currentDog.reference_image_id ? (
            <img
              src={`https://cdn2.thedogapi.com/images/${currentDog.reference_image_id}.jpg`}
              alt={currentDog.name}
              className="dog-image"
            />
          ) : (
            <p>No image found for this breed.</p>
          )}

          <div className="dog-info">
            <h2 className="clickable" onClick={() => toggleBan(currentDog.name)}>
              🐕 Breed: {currentDog.name}
            </h2>
            <p
              className="clickable"
              onClick={() => toggleBan(currentDog.origin || "Unknown")}
            >
              🌍 Origin: {currentDog.origin || "Unknown"}
            </p>
            <p>
              💬 Temperament: {currentDog.temperament || "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <p>Click the button to discover a new dog!</p>
      )}


      {/* 🚫 Ban list */}
      <div className="ban-list">
        <h3>🚫 Ban List</h3>
        {banList.length === 0 ? (
          <p>No banned attributes yet.</p>
        ) : (
          <ul>
            {banList.map((item, index) => (
              <li
                key={index}
                className="clickable banned-item"
                onClick={() => toggleBan(item)}
              >
                ❌ {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;

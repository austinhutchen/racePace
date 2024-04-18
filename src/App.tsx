// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import { set, get } from 'idb-keyval';

function App() {
  const [distance, setDistance] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [racePace, setRacePace] = useState<string>('');

  const calculateRacePace = async () => {
    if (distance === '' || time === '') {
      return;
    }

    const paceSecondsPerKm = (time * 60) / distance;
    const paceMinutesPerKm = paceSecondsPerKm / 60;

    setRacePace(`Your race pace for a ${distance} km race is approximately ${paceMinutesPerKm.toFixed(2)} minutes per kilometer.`);

    // Save data to IndexedDB for offline access
    await set('racePace', racePace);
  };

  // Load cached data on app startup
  get('racePace').then((cachedRacePace) => {
    if (cachedRacePace) {
      setRacePace(cachedRacePace);
    }
  });

  return (
    <div className="App">
      <h1>Race Pace Calculator</h1>
      <label htmlFor="distance">Distance (in kilometers):</label>
      <input
        type="number"
        id="distance"
        value={distance}
        onChange={(e) => setDistance(parseFloat(e.target.value))}
      />
      <br />
      <label htmlFor="time">Time (in minutes):</label>
      <input
        type="number"
        id="time"
        value={time}
        onChange={(e) => setTime(parseFloat(e.target.value))}
      />
      <br />
      <button onClick={calculateRacePace}>Calculate Pace</button>
      <p id="result">{racePace}</p>
    </div>
  );
}

export default App;

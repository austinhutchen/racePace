// src/App.tsx
import React, { useState, useEffect } from 'react';
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

    const newRacePace = `Your race pace for a ${distance} km race is approximately ${paceMinutesPerKm.toFixed(2)} minutes per kilometer.`;

    setRacePace(newRacePace);

    // Save data to IndexedDB for offline access
    await set('racePace', newRacePace);
  };

  // Load cached data on app startup
  useEffect(() => {
    get('racePace').then((cachedRacePace: any) => {
      if (cachedRacePace) {
        setRacePace(cachedRacePace);
      }
    });
  }, []);

  return (
    <div className="App" style={{
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <iframe src={process.env.PUBLIC_URL + '/myGif.gif'} width="auto" height="100%" className="giphy-embed" ></iframe>
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
      <button style={{
        backgroundColor: '#ff7f7f',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '1em',
        cursor: 'pointer',
        marginTop: '20px'
      }} onClick={calculateRacePace}>Calculate Pace</button>
      <p id="result">{racePace}</p>
    </div>
  );
}
export default App;
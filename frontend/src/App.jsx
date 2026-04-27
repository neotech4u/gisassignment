import React, { useState } from 'react';
import SatelliteForm from './components/SatelliteForm';
import ImageDisplay from './components/ImageDisplay';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageData, setImageData] = useState(null);

  const fetchSatelliteImage = async (formData) => {
    setLoading(true);
    setError(null);
    setImageData(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/get-satellite-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch image');
      }

      setImageData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>NeoEarth Portal</h1>
        <p>Dynamically retrieve satellite imagery from Google Earth Engine</p>
      </header>
      
      <main className="main-content">
        <section className="glass-panel form-container">
          <SatelliteForm onSubmit={fetchSatelliteImage} loading={loading} />
        </section>
        
        <section className="glass-panel display-container">
          <ImageDisplay loading={loading} error={error} imageData={imageData} />
        </section>
      </main>
    </div>
  );
}

export default App;

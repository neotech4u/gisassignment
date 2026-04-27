import React from 'react';

function ImageDisplay({ loading, error, imageData }) {
  if (loading) {
    return (
      <div className="image-wrapper" style={{ flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Contacting Earth Engine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-wrapper" style={{ padding: '2rem' }}>
        <div className="error-message">
          <h3>Error Fetching Image</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (imageData && imageData.url) {
    return (
      <div className="image-wrapper" style={{ position: 'relative' }}>
        {imageData.mock && (
          <div className="mock-badge">Mock Data (No Credentials)</div>
        )}
        <img 
          src={imageData.url} 
          alt="Satellite rendering from Google Earth Engine" 
          className="satellite-image"
        />
        {imageData.message && (
          <p style={{ 
            position: 'absolute', 
            bottom: '1rem', 
            background: 'rgba(0,0,0,0.7)', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}>
            {imageData.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="image-wrapper">
      <p className="placeholder-text">
        Select parameters and click "Fetch" to render satellite imagery here.
      </p>
    </div>
  );
}

export default ImageDisplay;

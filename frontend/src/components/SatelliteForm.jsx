import React, { useState } from 'react';
import MapPicker from './MapPicker';

function SatelliteForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    scale: '30',
    startDate: '',
    endDate: '',
    satellite: 'Sentinel-2'
  });

  const [errors, setErrors] = useState({});

  const handleLocationChange = (lat, lon) => {
    setFormData({
      ...formData,
      latitude: lat.toFixed(6),
      longitude: lon.toFixed(6)
    });
    
    if (errors.latitude || errors.longitude) {
      setErrors({ ...errors, latitude: null, longitude: null });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.latitude || isNaN(formData.latitude)) newErrors.latitude = 'Valid latitude is required';
    if (!formData.longitude || isNaN(formData.longitude)) newErrors.longitude = 'Valid longitude is required';
    if (!formData.scale || isNaN(formData.scale)) newErrors.scale = 'Valid scale is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        scale: parseFloat(formData.scale)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-content">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Location & Parameters</h2>
      
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label>Pick a Location</label>
        <MapPicker 
          lat={formData.latitude} 
          lon={formData.longitude} 
          onLocationChange={handleLocationChange} 
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            step="any"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="e.g. 37.7749"
          />
          {errors.latitude && <span style={{ color: 'var(--error-color)', fontSize: '0.8rem' }}>{errors.latitude}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            step="any"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="e.g. -122.4194"
          />
          {errors.longitude && <span style={{ color: 'var(--error-color)', fontSize: '0.8rem' }}>{errors.longitude}</span>}
        </div>
      </div>

      <div className="form-row" style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <span style={{ color: 'var(--error-color)', fontSize: '0.8rem' }}>{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <span style={{ color: 'var(--error-color)', fontSize: '0.8rem' }}>{errors.endDate}</span>}
        </div>
      </div>

      <div className="form-row" style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label htmlFor="satellite">Satellite Source</label>
          <select
            id="satellite"
            name="satellite"
            value={formData.satellite}
            onChange={handleChange}
          >
            <option value="Sentinel-2">Sentinel-2 (High Res)</option>
            <option value="Landsat 8">Landsat 8</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="scale">Scale (meters/pixel)</label>
          <input
            type="number"
            id="scale"
            name="scale"
            value={formData.scale}
            onChange={handleChange}
            min="10"
            max="1000"
          />
          {errors.scale && <span style={{ color: 'var(--error-color)', fontSize: '0.8rem' }}>{errors.scale}</span>}
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', marginTop: '2rem' }}>
        {loading ? 'Processing...' : 'Fetch Satellite Image'}
      </button>
    </form>
  );
}

export default SatelliteForm;

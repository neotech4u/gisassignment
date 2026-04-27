import sys
import json
import argparse
import os
import base64
import requests

# Try importing ee, if fails we will return a mock result
try:
    import ee
    HAS_EE = True
except ImportError:
    HAS_EE = False

def authenticate_and_initialize():
    """Authenticates to Earth Engine using service account credentials."""
    # Attempt to initialize with default credentials first (useful if gcloud auth is setup)
    try:
        ee.Initialize()
        return True
    except Exception as e:
        # If default initialization fails, we would try service account if provided in env
        # For security, we don't hardcode credentials here
        pass
    
    return False

def get_satellite_image(lat, lon, scale, start_date, end_date, satellite):
    if not HAS_EE:
        return {"error": "earthengine-api not installed. Please install 'earthengine-api' to fetch real data.", "mock": True}

    if not authenticate_and_initialize():
        # Fallback to returning a mock image since we don't have valid credentials in the demo
        return {
            "error": "Google Earth Engine Authentication Failed. Ensure you have run 'earthengine authenticate' or provided credentials.",
            "mock": True
        }

    try:
        point = ee.Geometry.Point([lon, lat])
        
        if satellite == 'Sentinel-2':
            collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
                            .filterBounds(point) \
                            .filterDate(start_date, end_date) \
                            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
            
            if collection.size().getInfo() == 0:
                return {"error": "No Sentinel-2 images found for the given criteria."}
                
            image = collection.first().select(['B4', 'B3', 'B2'])
            vis_params = {'min': 0, 'max': 3000}
            
        elif satellite == 'Landsat 8':
            collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
                            .filterBounds(point) \
                            .filterDate(start_date, end_date) \
                            .filter(ee.Filter.lt('CLOUD_COVER', 20))
                            
            if collection.size().getInfo() == 0:
                return {"error": "No Landsat 8 images found for the given criteria."}
                
            image = collection.first().select(['SR_B4', 'SR_B3', 'SR_B2'])
            vis_params = {'min': 0.0, 'max': 0.3} # Note: Landsat Collection 2 SR requires scaling, but keeping simple for thumbnail

        else:
            return {"error": f"Satellite {satellite} is not supported."}

        # Create a region around the point
        buffer_region = point.buffer(2000).bounds()

        # Generate a thumbnail URL
        thumbnail_url = image.getThumbURL({
            'region': buffer_region,
            'dimensions': 800,
            'format': 'png',
            **vis_params
        })

        return {"url": thumbnail_url}
    except Exception as e:
        return {"error": str(e)}

def mock_response(lat, lon, satellite):
    """Provides a dummy map preview since real GEE requires credentials."""
    # We use a static map API as a mock
    zoom = 14
    # Note: To be a truly robust app, the user would provide a real GEE credential.
    return {
        "url": f"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{zoom}/{int((90-lat)*2**zoom/180)}/{int((180+lon)*2**zoom/360)}",
        "mock": True,
        "message": "This is a mock image because Earth Engine credentials were not found."
    }

def main():
    parser = argparse.ArgumentParser(description="Fetch Satellite Image from Earth Engine")
    parser.add_argument('--lat', type=float, required=True)
    parser.add_argument('--lon', type=float, required=True)
    parser.add_argument('--scale', type=float, required=True)
    parser.add_argument('--start', type=str, required=True)
    parser.add_argument('--end', type=str, required=True)
    parser.add_argument('--satellite', type=str, required=True)
    
    args = parser.parse_args()

    # Try fetching real data
    result = get_satellite_image(args.lat, args.lon, args.scale, args.start, args.end, args.satellite)
    
    # If GEE fails (no auth), we fallback to mock to show the UI works
    if result.get("mock"):
        result = mock_response(args.lat, args.lon, args.satellite)
        
    print(json.dumps(result))

if __name__ == "__main__":
    main()

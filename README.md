# gisassignment-GIS, Drones & Machine Learning for Resource Mapping & Analysis – Batch 4
Assignment: ReactJS → NodeJS → Python → Google Earth Engine Workflow
📌 Project Overview
This assignment demonstrates a full‑stack workflow for geospatial data handling and satellite imagery retrieval:

Frontend (ReactJS)

Collects user input parameters:

Longitude/Latitude
Scale
Date Range
Satellite Source (e.g., Sentinel‑2, Landsat)
Backend (NodeJS REST API)
Receives input from ReactJS.
Forwards the request to a Python program running on the server.
Python + Google Earth Engine (GEE)
Uses the GEE API to fetch required satellite imagery based on user input.
Sends processed imagery back to the NodeJS server.
Response Handling
NodeJS returns the imagery/data to the ReactJS frontend for visualization or download.
This repository contains my **trial code** for the assignment integrating ReactJS, NodeJS, Python, and Google Earth Engine.
Mohamed Usman T M

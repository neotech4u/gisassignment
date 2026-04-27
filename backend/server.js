const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/get-satellite-image', (req, res) => {
    const { latitude, longitude, scale, startDate, endDate, satellite } = req.body;

    // Validation
    if (!latitude || !longitude || !scale || !startDate || !endDate || !satellite) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Fetching image for:', { latitude, longitude, scale, startDate, endDate, satellite });

    // Ensure python environment is correct
    // Note: depending on the system, this might be 'python' or 'python3'
    const pythonExecutable = 'python'; 
    const scriptPath = path.join(__dirname, 'gee_fetcher.py');

    // Passing parameters to Python script
    const pythonProcess = spawn(pythonExecutable, [
        scriptPath,
        '--lat', latitude,
        '--lon', longitude,
        '--scale', scale,
        '--start', startDate,
        '--end', endDate,
        '--satellite', satellite
    ]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        console.error('Python Error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Failed to process image', details: errorString });
        }

        try {
            // Python script should return a JSON object containing the result
            const result = JSON.parse(dataString);
            
            if (result.error) {
                return res.status(500).json({ error: result.error });
            }

            res.json({ url: result.url, data: result.data });
        } catch (err) {
            console.error('JSON Parse Error:', err);
            res.status(500).json({ error: 'Failed to parse python response', details: dataString });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

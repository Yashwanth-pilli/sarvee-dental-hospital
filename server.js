const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATABASE_PATH = path.join(__dirname, 'appointments.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(__dirname));

// Initialize Database if not exists
if (!fs.existsSync(DATABASE_PATH)) {
    fs.writeFileSync(DATABASE_PATH, JSON.stringify([], null, 2), 'utf8');
}

// POST: Add new appointment request
app.post('/api/appointments', (req, res) => {
    const { name, mobile, city, date, timeSlot, notes } = req.body;

    // Simple validation
    if (!name || !mobile) {
        return res.status(400).json({ 
            success: false, 
            message: 'Full name and mobile number are required.' 
        });
    }

    // Read existing database
    fs.readFile(DATABASE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading database file:', err);
            return res.status(500).json({ success: false, message: 'Database read failed.' });
        }

        let appointments = [];
        try {
            appointments = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            appointments = [];
        }

        // Add new record
        const newRecord = {
            id: Date.now(), // Unique ID based on time
            name: name.trim(),
            mobile: mobile.trim(),
            city: city ? city.trim() : '',
            date: date || '',
            timeSlot: timeSlot || '',
            notes: notes ? notes.trim() : '',
            timestamp: new Date().toISOString()
        };

        appointments.push(newRecord);

        // Save back to JSON file
        fs.writeFile(DATABASE_PATH, JSON.stringify(appointments, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to database file:', writeErr);
                return res.status(500).json({ success: false, message: 'Database write failed.' });
            }

            res.status(201).json({ 
                success: true, 
                message: 'Appointment request recorded successfully.' 
            });
        });
    });
});

// GET: View database file (Admin area)
app.get('/admin/appointments', (req, res) => {
    fs.readFile(DATABASE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading database file:', err);
            return res.status(500).json({ success: false, message: 'Database read failed.' });
        }
        
        let appointments = [];
        try {
            appointments = JSON.parse(data);
        } catch (parseErr) {
            appointments = [];
        }
        
        res.json(appointments);
    });
});

// Start listening
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Sarvee Dental Hospital server is running!`);
    console.log(`Open http://localhost:${PORT} in your browser.`);
    console.log(`Admin panel: http://localhost:${PORT}/admin/appointments`);
    console.log(`========================================`);
});

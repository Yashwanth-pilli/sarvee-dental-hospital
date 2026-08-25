=========================================================
SARVEE DENTAL HOSPITAL - APPOINTMENT BACKEND SERVER GUIDE
=========================================================

This project now includes a simple, modern backend using Node.js and Express to automatically save appointment requests from patients.

---------------------------------------------------------
PREREQUISITES
---------------------------------------------------------
Before running the website, make sure Node.js is installed on your computer.
- If you don't have it, download and install it from: https://nodejs.org/

---------------------------------------------------------
HOW TO RUN THE SITE AND APPOINTMENT BACKEND
---------------------------------------------------------

Step 1: Install dependencies
----------------------------
Open your Command Prompt, PowerShell, or Terminal in this folder ("Sarvee Dental Hospital") and run the following command to download Express:
   
   npm install

Step 2: Start the server
-------------------------
Once the installation finishes, run this command to start the backend:

   node server.js

Step 3: Browse the website
--------------------------
Open your web browser (Chrome, Edge, Firefox, or Safari) and go to:

   http://localhost:3000

Here, you can test the "Book Appointment" form. Submitting an appointment will immediately save the data.

---------------------------------------------------------
HOW TO VIEW AND DOWNLOAD APPOINTMENT REQUESTS
---------------------------------------------------------
To see all appointments requested by patients:
1. Open your web browser.
2. Go to:

   http://localhost:3000/admin/appointments

This will display a list of all submissions in raw JSON format, including:
- Full Name
- Mobile Number
- City/Area
- Date and Time Slot selected
- Reason/Notes
- Specific submission timestamp

You can right-click the page and select "Save as..." to download the entire list to your computer.

All appointment data is stored in the local file: appointments.json in the project root.
=========================================================

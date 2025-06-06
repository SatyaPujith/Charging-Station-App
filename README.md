# Charging Station Application
This is a full-stack application for managing electric vehicle charging stations. The frontend is built with Vue 3, and the backend is built with Node.js, Express, and MongoDB.

Live URL: [charging-station-app-six.vercel.app](https://charging-station-app-six.vercel.app)
## Project Structure

/backend: Contains the Node.js/Express backend.<br>
/frontend: Contains the Vue 3 frontend.

## Prerequisites

Node.js (v16 or later)
MongoDB Atlas account for the database
Git installed
Vercel account (for frontend deployment)
Render account (for backend deployment)

## Setup Instructions
### Backend Setup
Navigate to the Backend Directory:cd backend
```
Install Dependencies:npm install
```
Set Up Environment Variables:<br>
Create a .env file in the backend directory.<br>
Add your MongoDB Atlas connection <br>
```
string:MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/charging-station?retryWrites=true&w=majority
```

Replace <username> and <password> with your MongoDB Atlas credentials.

```
Run the Backend Locally:npm start
```

The backend will run on http://localhost:3000.
Test the API at http://localhost:3000/api/chargers.

Note: change the urls in frontend to http://localhost:3000 in components folder pages 

### Frontend Setup

Navigate to the Frontend Directory:cd frontend
```
Install Dependencies:npm install

```
Set Up Environment Variables:<br>
Create a .env file in the frontend directory.<br>
Add the backend API URL:VUE_APP_API_URL=http://localhost:3000<br>
```
Run the Frontend Locally:npm run serve
```

The frontend will run on http://localhost:8080.


## Deployment
### Backend Deployment (Render)

Push the backend folder to a GitHub repository.<br>
Create a new Web Service on Render:<br>
Environment: Node<br>
```
Build Command: npm install
Start Command: npm start
```
Add Environment Variable: MONGODB_URI (your MongoDB Atlas connection string)<br>


Deploy and get the backend URL (e.g., https://charging-station-backend.onrender.com).<br>

### Frontend Deployment (Vercel)

Push the frontend folder to a GitHub repository.<br>
Create a new project on Vercel:<br>
Framework Preset: Vue.js<br>
```
Build Command: npm run build
Output Directory: dist
```
Add Environment Variable: VUE_APP_API_URL (set to the backend URL from Render)<br>


Deploy and get the frontend URL (e.g., https://charging-station-frontend.vercel.app).<br>

## Usage

Frontend: Access the app via the Vercel URL, log in, and manage charging stations.<br>
Backend API: Use the Render URL to access endpoints like /api/chargers.<>br

## Features

Frontend: View charging stations on a map, add/edit/delete stations, filter by status/power output/connector type.<br>
Backend: REST API for managing charging stations, secured with JWT authentication.<br>


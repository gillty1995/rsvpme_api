**RSVPMe Backend**

**Overview**

The backend of RSVPMe is built using Express.js and Node.js with TypeScript for type safety and maintainability. It provides a RESTful API to manage events, authentication, user data, and contact forms, enabling seamless RSVP and event planning.

**Technologies Used**

_Core Framework:_

Express.js – Fast and minimalist web framework for Node.js
Node.js – JavaScript runtime for server-side development
TypeScript – Provides static typing and enhances code reliability

_Database:_

MongoDB – NoSQL database for storing user and event data
Deployment:
AWS EC2 – Cloud hosting solution
PM2 – Process manager for running and monitoring the backend
Nginx – Reverse proxy server for handling incoming requests

_Security & Middleware:_

CORS – Enables cross-origin requests
Helmet – Adds security headers to prevent attacks
Winston – Logging library for tracking API requests and errors
Express Rate Limit – Protects the API from excessive requests and abuse

_Authentication:_

Auth0 – Secure authentication and user management

_Email & Communication:_

Nodemailer – Handles email sending for contact forms

_Architecture_

The backend follows a Model-Controller-Routes (MCR) architecture:

Models – Define database schemas using Mongoose
Controllers – Handle business logic for each endpoint
Routes – Define API endpoints and link them to controllers
Middlewares – Handle security, authentication, and request validation

_Features_

User authentication and authorization via Auth0
Secure event creation and RSVP management
Google API integration for location and directions
Email support via Nodemailer for contact forms
Rate-limiting and security headers for protection
Logging and monitoring using Winston

_How It Works_

Users authenticate via Auth0 to access the application.
Events are created and managed using MongoDB.
RSVP and event details are securely handled via the API.
Emails are sent using Nodemailer for communication.
The backend is continuously monitored using PM2 and logs errors with Winston.

_This backend was designed to simplify event planning and RSVP management while ensuring security, scalability, and a seamless user experience._

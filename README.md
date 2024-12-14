# RSVPme - User Authentication API

This is the user authentication API for the RSVPme website, built with Express. It handles user registration, login, profile management, and user details updates.

## Features (Implemented)

- **User Registration**: Allows users to create an account with a unique email and password.
- **User Login**: Users can log in with their email and password to receive a JWT token for authentication.
- **User Profile**: Authenticated users can fetch their profile details.
- **Update User Details**: Users can update their name and profile details after logging in.

## Routes

- `POST /users/register`: Register a new user
- `POST /users/login`: Log in and receive a JWT token
- `GET /users/profile`: Fetch the user's profile (authentication required)
- `PUT /users/profile`: Update the user's profile (authentication required)

## Future Features

- **Chat Functionality**: To be added later for real-time messaging between users.
- **Email and Text Notifications**: RSVP invites and notifications will be sent to users.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

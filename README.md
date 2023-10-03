# ApiNotifier

This is a simple Node.js application that provides user registration, login, and messaging functionalities. It uses the Express.js framework for building the RESTful API, and data is stored in JSON files with encryption for security. 

**Note:** This project is hosted on Replit, and you can access it [here](https://replit.com/@FoRoKo/Notifier).

## Table of Contents

- [Project Structure](#project-structure)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Add Message](#add-message)
  - [Get Messages](#get-messages)
  - [Remove Message](#remove-message)
- [Development](#development)

## Project Structure

The project consists of the following main components:

- `server.js`: The main server script that sets up the Express.js server, defines API endpoints, and handles data storage and encryption.
- `users.json`: JSON file where user data is stored after encryption.
- `messages.json`: JSON file where messages are stored after encryption.
- `package.json`: Node.js package configuration file with dependencies and scripts.

## Setup

Before running the project, make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

1. Clone the repository to your local machine:
```
git clone https://github.com/FoRoKo1o/ApiNotifier
cd <repository-folder>
```

2. Install project dependencies:
```
npm install
```

3. Set your encryption secret key as an environment variable:
```
export secretKey=<your-secret-key>
```

4. Start the server:
```
npm start
```

The server should now be running on `http://localhost:3000`.

## API Endpoints

### User Registration

- **Endpoint:** `/register`
- **Method:** `POST`
- **Request Body:**
- `username`: User's username
- `password`: User's password

Registers a new user with a unique username and password combination. User data is stored in an encrypted `users.json` file.

### User Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Request Body:**
- `username`: User's username
- `password`: User's password

Authenticates a user by checking the provided username and password against the stored user data in `users.json`.

### Add Message

- **Endpoint:** `/addmessage`
- **Method:** `POST`
- **Request Body:**
- `userId`: ID of the user sending the message
- `date`: Date of the message
- `hour`: Hour of the message
- `message`: The message content

Adds a new message to the system, associating it with the user's ID. Messages are stored in an encrypted `messages.json` file.

### Get Messages

- **Endpoint:** `/getmessages/:userId`
- **Method:** `GET`
- **URL Parameter:** `userId` - ID of the user whose messages to retrieve

Retrieves all messages associated with a specific user based on their ID.

### Remove Message

- **Endpoint:** `/removemessage`
- **Method:** `POST`
- **Request Body:**
- `userId`: ID of the user removing the message
- `date`: Date of the message to be removed
- `hour`: Hour of the message to be removed
- `message`: The message content to be removed

Removes a specific message associated with a user based on the provided information. The message is deleted from the encrypted `messages.json` file.

## Development

The project includes additional development-only endpoints (`/getallmessages` and `/getallusers`) for retrieving all messages and users. These endpoints are commented out in the code and should be used for debugging and development purposes only. Uncomment them if needed.

**Note:** This project is intended for educational purposes and may require further enhancements for production use, such as better error handling and user authentication mechanisms.

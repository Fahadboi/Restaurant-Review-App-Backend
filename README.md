# Restaurant Review App Backend

This repository contains the backend code for the Restaurant Review App. The backend is built using Node.js, Express, and MongoDB, providing RESTful APIs for managing restaurants, products, and reviews.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Setup and Installation](#setup-and-installation)
4. [Environment Variables](#environment-variables)
5. [Error Handling](#error-handling)
6. [License](#license)

## Features

- **User Authentication**: Secure authentication using JWT.
- **Restaurant Management**: CRUD operations for restaurants.
- **Product Management**: CRUD operations for products offered by restaurants.
- **Review and Rating System**: Users can rate and review products.
- **Search and Filter**: Search and filter products based on various criteria.
- **Pagination**: Supports pagination for products and reviews.
- **Role-Based Access Control**: Different access levels for restaurant owners and customers.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB and Node.js.
- **JWT**: JSON Web Tokens for authentication.
- **Bcrypt**: Library for hashing passwords.

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or cloud instance)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/restaurant-review-app-backend.git
   cd servers 
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the required environment variables (see below).

4. **Run the application:**

   ```bash
   npm start
   ```

   The server will start on the port specified in the `.env` file.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
PORT=YOUR_PORT_HERE
MONGO_DB_URL=MONGO_DB_URL
ACCESS_TOKEN_SECRET="YOUR OWN SECRET"
ACCESS_TOKEN_EXPIRY=e.g: 1d
REFRESH_TOKEN_SECRET="YOUR OWN SECRET"
REFRESH_TOKEN_EXPIRY=e.g: 30d
```


## Error Handling

All errors are handled centrally in the application. The API responses follow a consistent structure for errors and success messages.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

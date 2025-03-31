
# Mini-Twitter

Mini-Twitter is a simplified clone of Twitter built with a React frontend and a Node.js backend. This project allows users to create accounts, post updates(working on the frontend part), follow(working on the frontend part) other users(working on the frontend part), and search people in the explore part(working on the frontend part).

## Updates

### June 2024
- The project is live now at `https://twittermini.vercel.app/`
- The backend server is now live! You can use it by only building the frontend. 
- To access the backend API, point your requests to `https://mini-twitter-4o2f.onrender.com`.


## Features

- **User Authentication**: Sign up, log in, and manage user sessions.
- **Post Creation**: Create and share posts.
- **User Profiles**: View and edit user profiles.
- **Follow System**: Follow and unfollow other users.
- **Explore**: Search for users and explore trending topics.
- **Responsive Design**: Fully responsive design for mobile and desktop users.

## Tech Stack

- **Frontend**: React, Styled Components
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Others**: Vite (for frontend build), GitHub for version control

## Project Structure

- **backend**: Contains the Node.js server and API routes.
- **frontend**: Contains the React application.

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB

### Cloning the Repository

```bash
git clone https://github.com/shaif-codes/Mini-Twitter.git
cd Mini-Twitter
```

### Setting Up the Backend

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install the required packages:

    ```bash
    npm install
    ```

3. Create a `.env` file in the backend directory and add the following environment variables:

    ```env
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    PORT=5000
    FIREBASE_ACCOUNT_TYPE=
    process.env.FIREBASE_PROJECT_ID=
    FIREBASE_PRIVATE_KEY_ID=
    FIREBASE_PRIVATE_KEY=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_CLIENT_ID=
    FIREBASE_AUTH_URI=
    FIREBASE_TOKEN_URI=
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
    FIREBASE_CLIENT_X509_CERT_URL=
    FIREBASE_UNIVERSE_DOMAIN=
    ```

4. Start the backend server:

    ```bash
    npm start
    ```

    The backend server should now be running on `http://localhost:5000`.

### Setting Up the Frontend

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install the required packages:

    ```bash
    npm install
    ```

3. Create a .config file where you add API_URL:
    ```
    VITE_API_URL=http://localhost:5000
    ```
    or
   ```
   VITE_API_URL==<your_backend_server_url>
    ```
   

5. Start the frontend development server:

    ```bash
    npm run dev
    ```

    The frontend server should now be running on `http://localhost:5173`.

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Sign up for a new account or log in with an existing one.
3. Explore the app by creating posts, following other users, and exploring trending topics.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

If you have any questions, feel free to reach out via GitHub issues.

---

Thank you for checking out Mini-Twitter! We hope you find this project useful and informative.
```

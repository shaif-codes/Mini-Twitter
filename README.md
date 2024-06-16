
# Mini-Twitter

Mini-Twitter is a simplified clone of Twitter built with a React frontend and a Node.js backend. This project allows users to create accounts, post updates, follow other users, and explore trending topics.

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

3. Create a `vite.config.js` file in the frontend directory and add the following proxy configuration:

    ```js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
    });
    ```

4. Start the frontend development server:

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

This README provides a detailed overview of your project, including setup instructions, features, and more. Make sure to replace placeholders like `<your_mongodb_connection_string>` and `<your_jwt_secret>` with actual values when setting up your environment.

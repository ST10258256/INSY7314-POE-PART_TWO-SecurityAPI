# INSY7314-POE-PART_TWO-SecurityAPI

---
## Overview of the app
SecurityAPI is a web application built using:

- Backend: ASP.NET Core Web API (C#)

- Frontend: React + Vite

- Database: MongoDB

- Hosting: Render for the backend; local for the frontend

The system provides secure user authentication using JWT, API communication, and frontend UI.


## Here is a guide for the devlopers on the app on how to operate: [GUIDE.md](https://github.com/ST10258256/INSY7314-POE-PART_TWO-SecurityAPI/blob/main/GUIDE.md)

---

## Features

- User Authentication

- JWT Token Generation and secure authorization

- Cross-Origin Resource Sharing configured for HTTPS

- Environment-based configuration

- MongoDB integration for data storage

- React + Vite frontend with secure HTTPS

- Rate limiting is implemented

- CSP is also Implemented

---

## How to get started using our app

1. You will have to clone or fork the repo

```bash
git clone https://github.com/ST10258256/INSY7314-POE-PART_TWO-SecurityAPI.git
```

2. Once you have the repo you will have to cd into the frontend

```bash
cd Frontend
```

3. Once you have done that you will have to run the frontend

```bash
npm run dev
```

4. Click on the link it gives you
5. This will take you to your localhost on the webpage
6. This is all done over ssl and the backend is being hosted over render so you will not have to run anything else
7. Now you can interact with the app and make an account; login; make payments and view the payments that you have made

### Running backend locally

1. Follow the steps previously and once you have cloned the repo you must run your backend so use this code

```bash
cd Backend
dotnet build
dotnet run

```

2. Once this is done you will be running your backend locally instead and then you will have to follow the rest of the steps

### Creating your own database

If you want to make your own you will need to create a environment variable with the required information 

```bash
MONGO_URI= <connection string>
MONGO_DATABASE_NAME=<datbase name>

JWT_KEY=<yourkey>
JWT_ISSUER=<who issued it>
JWT_EXPIREMINUTES<giver expirey date>
```

---

## Software used in this project

- npm
- Render
- Swagger
- MongoDB
- React + Vite
- Docker
- JWT
- CSP


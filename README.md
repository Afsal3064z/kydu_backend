<<<<<<< HEAD
# Kydu - Node.js API

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) <br/>
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

```
  ██╗  ██╗██╗   ██╗██████╗ ██╗   ██╗
  ██║ ██╔╝╚██╗ ██╔╝██╔══██╗██║   ██║
  █████╔╝  ╚████╔╝ ██║  ██║██║   ██║
  ██╔═██╗   ╚██╔╝  ██║  ██║██║   ██║
  ██║  ██╗   ██║   ██████╔╝╚██████╔╝
  ╚═╝  ╚═╝   ╚═╝   ╚═════╝  ╚═════╝ 
```

**Kydu** is a mobile application built as an online platform where anyone can post "gigs" requesting assistance with a variety of tasks such as personal aid, relocation, delivery, handyman services, and more. Others users close by have the opportunity to accept these gigs in exchange for a monetary reward.

This repository contains the Node.js backend API for the application written using TypeScript. [Express](https://expressjs.com/) was chosen due to it's simplicity and [MongoDB](https://www.mongodb.com/) is used as the database of choice because of the built-in support for working with Geospatial data, which the application heavily relies on to query location based data.

## Features

- User registration and subsequent logins are handled through JWT tokens that need to be set in the headers as `Authorization: Bearer {token}`.
- Express objects such as `req.body`, `req.params`, and `req.query` are all validated and parsed through Zod.
- Geospatial lookups for data based on location are done using MongoDB Geospatial indexes.
- Unit tests are written using Jest to test and ensure the correctness of general backend functionality.

## 🚀 Getting Started

### Installation

1. Clone the repository.

```sh
git clone https://github.com/waterrmalann/kydu.git
```

2. Install the dependencies. (frontend and backend are decoupled)

```sh
pnpm install
```

3. Rename `.exmaple-env` to `.env` and configure the variables accordingly.

4. Run the project.

```sh
pnpm dev
```

5. Consume the API.

```
Your mobile, or web application should now be able to make requests to http://localhost:3000
```

## 🤝 Contribution

This repository is currently not accepting additional feature contributions because it will also need to be implemented in the clients that consume this backend, particularly a Flutter powered mobile application. However, feel free to open a pull request to fix any issues, add tests, or to make improvements that does not affect the functionality or structure of the APIs that are exposed. If you're in doubt about whether the PR would be accepted or not, you can always open an issue to get my opinion on it.

## 📃 License

This project is licensed under **AGPLv3**, see [LICENSE](LICENSE).
=======
# kydu_backend
Thisi s the backend for the kydu [Flutter] application
>>>>>>> 36005ea3c3c2d23017d1712ee6eb6c8cf1fdaf4f

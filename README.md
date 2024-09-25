# Orbit (WIP)

_Orbit_ is a web app powered by Next.js, Three.js and the whole backend is written in GO.

- This project is our main submition into the NASA Space Apps **Cairo** for this years iteration.
- This project is completly open-source and may recieve updates & patches after the hackathon.

---

### Project Overview

This project is designed to interact with a database and expose APIs to manage users, their visits, and NEOs (Near-Earth Objects). The main functionalities include fetching data from a database and responding with a JSONified format, making it easy to handle various requests in a structured way.
Features

- User Management: User information, visits tracking, favorite NEOs, and structured response for API calls.
- NEO Management: NEO database with visit tracking and descriptions.
- Visit Tracking: Tracks user visits with unique random keys.

##### Why we chose GO?

- Cus it's faster (we go brrr).
- Has a smaller code-print than python for example.
- Why not use go.

### Installation

Prerequisites:

- Go 1.23.0
- A working database setup (PostgreSQL, MySQL, etc.)

##### How to run the app:
##### Setup the frontend
```bash
bun run dev
```

##### Setup the backend
```bash
git clone https://github.com/TheGrandMasons/orbit.git
```

```bash
go mod tidy
```

```bash
go build
```

### Contributing

**ONLY FOR SPACE APPS TEAM MEMBERS!** (until Oct 8th) Please follow these steps:

- Create a new branch.
- Commit your changes.
- Submit a pull request.

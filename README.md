# Orbit

**Orbit** is an interactive 3D web application designed to simulate the solar system and track Near-Earth Objects (NEOs). The project utilizes **Next.js** for the frontend, **Three.js** for 3D rendering, and a **Golang** backend. This is our official submission for the **NASA Space Apps Cairo 2024** hackathon. Post-hackathon, this project will remain open-source, and we plan to continue developing and refining it based on community feedback and new feature ideas.

---

## High-Level Summary

**Orbit** serves as a platform for both educational and scientific purposes, bringing real-time space data to the general public and space enthusiasts. By leveraging NASA's open-source datasets, the web app provides users with the ability to explore celestial bodies and understand their trajectories in an interactive and visually appealing manner.

The primary focus of Orbit is to educate users about the threats posed by Near-Earth Objects (NEOs) and Potentially Hazardous Asteroids (PHAs), while also offering a unique visualization tool to simulate the solar system’s dynamics in real-time. The app tracks NEOs, allowing users to see these objects’ orbits, get detailed information, and manage their favorite NEOs via a personalized dashboard.

---

## Project Details

Orbit provides the following key functionalities:

### **1. NEO Management**
- **NEO Database Integration:** The app is integrated with NASA's **Small Body Database**, fetching up-to-date information on all NEOs, including Potentially Hazardous Asteroids (PHAs).
- **Real-Time Data Updates:** The backend periodically refreshes the NEO database to keep track of any changes in orbital data or newly discovered NEOs.
- **Detailed Object Pages:** For every NEO, a detailed page is available showing its Keplerian parameters (e.g., eccentricity, semi-major axis, inclination), visualized with accurate orbital trajectories.

### **2. 3D Visualization with Three.js**
- **Interactive Orrery:** A core feature of Orbit is the 3D orrery that allows users to explore the solar system. Built with **Three.js**, this provides real-time orbits, interactive controls (zoom, rotate, pan), and an engaging visualization of celestial movements.
- **Dynamic Simulation:** Users can control the speed of time, moving forwards or backwards, to see the past and future positions of celestial objects.
- **Point of View Control:** Users can change their perspective to explore the solar system from different angles or switch to a first-person view for an immersive experience of flying through space.

### **3. Visit Tracking**
- **Session-Based Tracking:** We generate a unique session key for each user visit, enabling us to track and log user behavior and interactions with the platform. This helps in analyzing user patterns and improving the experience based on actual user interaction data.
- **Historical Tracking:** Users can review their past interactions with the app and revisit objects or timeframes they explored during previous sessions.

---

## Use of Artificial Intelligence

Orbit integrates AI capabilities using two cutting-edge technologies:

### **1. Gemini API for AI-Powered Chatbot**
We integrated the **Gemini API** to create an **AI-powered chatbot** that answers user queries about space, NEOs, and the solar system in general. The chatbot provides real-time responses using curated data, offering users insights and helping them understand complex space-related topics in a user-friendly manner. 

- **Q&A Functionality:** Users can ask questions like, “What is the current position of asteroid XYZ?” or “Which NEOs are closest to Earth this month?” and the chatbot provides instant, reliable answers.
- **Educational Assistance:** The chatbot also serves as an educational tool for users unfamiliar with celestial terminology or orbital mechanics.

### **2. Claude for Complex Computations**
We utilize **Claude**, a powerful AI tool, for handling **complex astronomical computations** related to orbital mechanics. Claude processes large datasets, running intensive calculations that would otherwise slow down the web app or backend, ensuring smooth performance and fast response times.

- **Orbital Propagation:** Claude helps in predicting future orbital positions of NEOs by applying accurate Keplerian elements and propagating them over time, allowing users to visualize future encounters or potential threats to Earth.
- **Real-Time Updates:** Claude also assists in refining predictions and running background calculations, ensuring real-time data is always up-to-date without compromising the speed of user interactions.

---

## Space Agency Data

Orbit’s main data sources are provided by NASA’s publicly available space data. We heavily rely on NASA’s **Small Body Database (SBD)** for information about NEOs, their orbital parameters, and potential hazards to Earth. This database provides all the necessary Keplerian parameters for plotting accurate orbits and identifying key features of NEOs.

- **Keplerian Elements:** The platform calculates orbits using Keplerian elements such as eccentricity, inclination, and semi-major axis.
- **Regular Updates:** Our backend fetches updates from NASA’s database periodically to ensure the app stays current with the latest NEO discoveries and orbital adjustments.

---

## Hackathon Journey

Our development process for the hackathon followed these steps:

### **1. Planning Phase**
We began by brainstorming features that would be both useful and achievable within the hackathon timeline. We identified our primary focus as user interaction, real-time visualization, and NEO tracking. After reviewing NASA's datasets, we also decided to use AI to enhance the user experience.

### **2. Development Phase**
We split the project into front-end and back-end development:
- The **frontend** team worked on creating an intuitive user interface with **Next.js** and designed the interactive 3D orrery with **Three.js**.
- The **backend** team focused on building a scalable API using **Golang**, integrating with NASA’s database, and managing user sessions and NEO tracking functionalities.

### **3. Overcoming Challenges**
Key challenges included rendering real-time data updates in the 3D visualization, optimizing AI response time for the chatbot, and ensuring that complex orbital computations didn’t affect the performance of the app. We leveraged **Claude** for intensive calculations and tested multiple caching strategies for data efficiency.

### **4. Testing and Optimization**
We performed rigorous testing across multiple browsers and devices to ensure seamless performance. The app was optimized for both desktop and mobile devices, and we tested the orrery’s 3D performance under various user interactions (e.g., zooming, rotating).

---

## References

- **NASA Small Body Database**: [NASA SBD](https://ssd.jpl.nasa.gov/tools/sbdb_query.html)
- **Gemini API**: Used for the AI chatbot functionality.
- **Claude AI**: Used for complex astronomical computations.
- **Next.js**: Framework for frontend development.
- **Three.js**: Library for rendering 3D graphics and the interactive orrery.
- **Golang**: Backend for API management and data retrieval.

---

## Installation

### Prerequisites

- **Go**: Version 1.23.0 or higher
- **Node.js**: Latest version for running the frontend
- A working database setup (e.g., PostgreSQL, MySQL, etc.)

### How to Run the App

1. Install dependencies
    ```bash
    bun install
    ```
2. Start the development server
    ```bash
    bun run dev
    ```
---

## Contributing

**Space Apps Team Members Only (until Oct 8th):**  
To contribute, follow these steps:

1. Create a new branch for your changes.
2. Commit your changes with a descriptive message.
3. Submit a pull request for review.

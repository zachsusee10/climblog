# ClimbLog

A web app for tracking your climbing sessions. Log your climbs, see your progress, and check out some stats on your sends.

## Live Site

climblog.zachsusee.com

Note: the live site uses a slightly different, private repo.

## What it does

Basically, it's a climbing journal that lives in your browser. You can:
- Log climbs with grade, type, location, and whether you sent it
- View all your climbs with filters (by grade, type, gym, sent status)
- See analytics on your climbing - grade distribution, sends over time, that kind of thing
- Track your hardest send and most recent climb on the home page

## Tech Stack

**Backend:**
- Spring Boot 3.5.3 (Java)
- MySQL (or PostgreSQL if you prefer)
- JWT for auth
- Spring Security

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Recharts for the analytics

## Getting Started

### Prerequisites

You'll need:
- Java 24 (or whatever version Spring Boot 3.5.3 supports)
- Node.js and npm
- MySQL (or PostgreSQL)
- Maven

### Backend Setup

1. Clone the repo and navigate to the `climblog` directory

2. Set up your database. Create a MySQL database:
   ```sql
   CREATE DATABASE climblog;
   ```

3. Copy `src/main/resources/application.properties.example` to `application.properties` and fill in your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/climblog
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

   Also set a JWT secret (generate one with `openssl rand -base64 32` or just make up a long random string):
   ```properties
   jwt.secret=your-super-secret-key-here-minimum-32-characters
   ```

4. Run the backend:
   ```bash
   mvn spring-boot:run
   ```

   Should start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:5173` by default

4. If your backend is on a different port, you can set the API base URL with an environment variable:
   ```bash
   VITE_API_BASE=http://localhost:8080/api npm run dev
   ```

## Usage

1. Register a new account or log in
2. Start logging climbs - click "Log Climb" and fill out the form
3. Check out your climbs list to see everything you've logged
4. Head to Analytics to see some charts on your progress

## Database Schema

There are three main tables:
- `user` - user accounts (username, email, hashed password)
- `climb` - your climbing sessions (linked to users)
- `gym` - gym locations (not really used much right now)

The app uses JPA/Hibernate, so it'll create/update tables automatically if you have `spring.jpa.hibernate.ddl-auto=update` in your properties file.

## Notes

- Passwords are hashed with BCrypt before storing
- JWT tokens expire after 24 hours (configurable)
- All climb data is user-specific - you can only see your own climbs
- The difficulty calculation is a bit hacky (see `Utils.java` if you're curious) but it works for normalizing boulder grades (V-scale) and sport grades (YDS)

## Building for Production

**Backend:**
```bash
mvn clean package
```
This creates a JAR file in `target/` that you can run with `java -jar`

**Frontend:**
```bash
npm run build
```
Output goes to `frontend/dist/` - serve it with any static file server or point your backend to serve it.

## License

This is just a personal project, so do whatever you want with it.

## Contributing

This is a personal project, but if you find bugs or have suggestions, feel free to open an issue or PR.

# Shopping List API

RESTful API for managing shopping list items, built with Express.js, TypeScript, and MongoDB.

## 🚀 Features

- ✅ RESTful API with CRUD operations for shopping items
- 🔒 Security headers with Helmet
- 🌐 CORS support
- 📝 Request logging with Morgan
- ✨ Type-safe with TypeScript and Zod validation
- 🗄️ MongoDB with Mongoose ODM
- 🧪 Comprehensive testing with Vitest
- 🐳 Docker Compose for MongoDB
- 🔄 Hot reload in development
- 📊 Code formatting with Biome

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/philippspitzley/shopping-list-backend.git &&
   cd shopping-list-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
  ```shell
  cp .env.example .env
  ```

## 🚀 Getting Started

1. **Start MongoDB with Docker**
   ```bash
   npm run db:up
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

3. **Seed the database** (optional)
   ```bash
   npm run db:seed
   ```




## 📚 API Endpoints

### Health Check
- `GET /health` - API health status

### Items
- `GET /api/items` - Get all shopping items
- `GET /api/items/:id` - Get a specific item by ID
- `POST /api/items` - Create a new item
- `PATCH /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

### Example Request

**Create an item:**
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Apples"}'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Apples",
  "bought": false,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm run db:up` | Start MongoDB container |
| `npm run db:down` | Stop MongoDB container |
| `npm run db:logs` | View MongoDB logs |
| `npm run db:shell` | Open MongoDB shell |
| `npm run db:seed` | Seed database with sample data |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run lint` | Check code for errors and style issues |
| `npm run lint:fix` | Check and auto-fix all code issues |
| `npm run format` | Format all files without linting |


## ✨ Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting, with automatic pre-commit hooks to ensure code quality.


### Git Hooks

Pre-commit hooks are automatically installed via `simple-git-hooks` when you run `npm install`. 

**What happens on commit:**
- Biome automatically checks and formats **only your staged files**
- Issues are auto-fixed when possible
- Commit is blocked if there are unfixable errors


> [!TIP]  
> Use `npm run prepare` to reinstall all configured git-hooks. For example when you add or edit the configuration in `package.json` 


## 🏗️ Project Structure

```
shopping-list-backend/
├── src/
│   ├── controllers/      # Route controllers
│   ├── db/              # Database connection & models
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes & schemas
│   ├── index.ts         # Application entry point
│   └── server.ts        # Express app configuration
├── tests/               # Test files
├── env.ts              # Environment configuration
├── .env.example        # Environment variables template
└── package.json
```


## 🔧 Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Validation:** Zod
- **Testing:** Vitest + Supertest
- **Security:** Helmet, CORS
- **Code Quality:** Biome
- **Development:** tsx (TypeScript execution)


## 📝 License

MIT

---

Built with ❤️ using Express and MongoDB

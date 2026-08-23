# FinChat - Personal Financial Management

---

## Tech Stack

[![.NET 9](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-000000?logo=expo)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)

**FinChat** is a complete and modern personal finance management system. Designed with a robust, scalable, and decoupled architecture, it features a high-performance backend API in **.NET 9** and a mobile/web application developed in **React Native with Expo**.

---

## Architecture & Project Structure

The project follows the **Clean Architecture** pattern, ensuring that business rules remain independent of frameworks, databases, or user interfaces.

```text
Personal-finances/
├── docker-compose.yml         # PostgreSQL 16 container configuration
├── PROJECT_CONTEXT.md         # Internal project context and documentation
├── README.md                  # Project documentation
├── src/                       # Backend source code (.NET 9)
│   ├── FinChat.slnx           # .NET Solution File
│   ├── Api/                   # Presentation Layer (REST Controllers, Middlewares)
│   │   ├── Controllers/       # CategoryController, ExpenseController
│   │   ├── Middleware/        # DomainExceptionMiddleware (Centralized error handling)
│   │   └── Program.cs         # Entry point, dependency injection, and CORS setup
│   ├── Application/           # Application Layer (Services, DTOs, Mappings)
│   │   ├── Services/          # CategoryService, ExpenseService
│   │   └── Dtos/              # Data Transfer Objects
│   ├── Domain/                # Domain Layer (Pure Business Rules)
│   │   ├── Exceptions/        # DomainException
│   │   ├── Entities/          # Category, Expense
│   │   └── Interfaces/        # Repository and Service Contracts
│   └── Infrastructure/        # Infrastructure Layer (Data Access & Persistence)
│       ├── Persistence/       # AppDbContext, DbInitializer (Migrations & Seeding)
│       └── Repositories/      # CategoryRepository, ExpenseRepository
├── frontend/                  # Frontend source code (React Native / Expo)
│   ├── App.tsx                # Root Application Component
│   ├── index.ts               # Expo Entry Point
│   ├── app.json               # Expo Configuration
│   ├── components/            # Reusable UI Components
│   ├── services/              # HTTP API Integration Services
│   └── constants/             # Constants, Colors, and Themes
└── tests/                     # Automated Test Projects (xUnit / Moq)
    └── FinChat.Application.Tests/
```

---

## Clone repository
### Prerequisites

 Have installed on your machine:
- [Git](https://git-scm.com/)
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (version 18 or higher) & npm
- [Docker](https://www.docker.com/) and Docker Compose
- (Optional for mobile) **Expo Go** app on your physical device or a configured Android/iOS Emulator.

---

### Step 1: Clone the Repository

Open the terminal and run the command:

```bash
git clone https://github.com/Murilets/Personal-finances.git
cd Personal-finances
```

---

### Step 2: Start the Database (PostgreSQL)

Use Docker Compose to create and start the PostgreSQL container:

```bash
docker-compose up -d
```

> **Note**: The default pre-configured credentials in `docker-compose.yml` are:
> - **Host**: `localhost`
> - **Port**: `5432`
> - **Database**: `finchat`
> - **User**: `finchat`
> - **Password**: `finchat`

---

### Step 3: Run the Backend API

Navigate to the API folder and run the application. On first startup, the API will automatically run database **Migrations** and initial **Seeding** via `DbInitializer`.

```bash
# Navigate to API directory
cd src/Api

# Run the API
dotnet run
```

Or, if you prefer automatic reload mode (Hot Reload):

```bash
dotnet watch run
```

The API will be running at:
- HTTP: `http://localhost:5000` or `http://localhost:5169` (according to `appsettings.json` / launchSettings)
- OpenAPI/Swagger Documentation: `http://localhost:5000/openapi/v1.json` or Swagger UI.

---

### Step 4: Run the Frontend (Expo)

Open a new terminal window and navigate to the `frontend` folder:

```bash
# Enter frontend directory
cd frontend

# Install dependencies
npm install

# Start Expo server
npx expo start
```

In the Expo terminal, you can choose how to view the app:
- Press **`w`** to open in the **Web Browser**.
---

## API Endpoints

Below are the main endpoints provided by the FinChat REST API:

### Categories (`/api/categories`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Lists all registered categories |
| `GET` | `/api/categories/{id}` | Retrieves category details by ID |
| `POST` | `/api/categories` | Creates a new category |
| `PUT` | `/api/categories/{id}` | Updates an existing category |
| `DELETE` | `/api/categories/{id}` | Deletes a category |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/expenses` | Lists expenses with optional filter support (`startDate`, `endDate`, `categoryId`) |
| `GET` | `/api/expenses/{id}` | Retrieves specific expense details |
| `POST` | `/api/expenses` | Registers a new expense |
| `PUT` | `/api/expenses/{id}` | Updates an existing expense |
| `DELETE` | `/api/expenses/{id}` | Removes an expense |

---

## License

This project is developed for personal finance management and educational purposes. Feel free to contribute or use it as a foundation for your own projects!

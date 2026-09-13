# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

FinChat is a personal finance app: a .NET 9 REST API (`src/`, Clean Architecture, EF Core + PostgreSQL 16) and a React Native / Expo SDK 54 client (`frontend/`) that targets web, Android and iOS from one codebase. User-facing strings and many code comments are in Portuguese (pt-BR); keep new UI text and domain error messages in Portuguese.

## Commands

Run all commands from the repo root unless noted.

```bash
docker-compose up -d                       # PostgreSQL on localhost:5432 (db/user/password: finchat)
dotnet run --project src/Api               # API on http://localhost:5132 (applies pending migrations on startup)
dotnet watch run --project src/Api         # API with hot reload
dotnet build src/FinChat.slnx
```

EF Core migrations live in the Infrastructure project, but the Api project is the startup project:

```bash
dotnet ef migrations add <Name> --project src/Infrastructure --startup-project src/Api --output-dir Persistence/Migrations
```

Frontend (from `frontend/`):

```bash
npm install
npm run web          # or: npx expo start (then press w / a / i)
npx tsc --noEmit     # type-check; there is no lint or test script
```

`.claude/launch.json` defines the preview servers `finchat-frontend` (port 8081) and `finchat-backend` (port 5132).

Tests: the README describes `tests/FinChat.Application.Tests` (xUnit/Moq), but the directory is currently empty and not in the solution, so there are no tests to run yet.

## Backend architecture (`src/`)

Dependencies flow inward: `Api → Application → Domain`, and `Infrastructure → Domain`. Each outer layer registers its services through an extension method (`AddApplication()` in `Application/DependencyInjection.cs`, `AddInfrastructure(configuration)` in `Infrastructure/DependencyInjection.cs`), and `Api/Program.cs` calls both.

- **Domain**: entities have private setters and a private constructor, and they enforce their own invariants. You create them with a static `Create(...)` factory and change them with methods such as `Update(...)`. Repository interfaces (`ICategoryRepository`, `IExpenseRepository`) are defined here too.
- **Application**: services receive DTO records from `Dtos/` (`Create*Request`, `Update*Request`, `*Response`), load entities through repository interfaces, and map to response DTOs by hand with private `MapToResponse` helpers. No mapping library is used.
- **Infrastructure**: `AppDbContext` picks up every `IEntityTypeConfiguration` in `Persistence/Configurations` through `ApplyConfigurationsFromAssembly`. Repositories call `SaveChangesAsync` themselves, so there is no separate unit of work. Read queries use `Include(Category)` and `AsNoTracking()`. `DbInitializer` only runs `MigrateAsync()` at startup; it does not seed data. The connection string is `ConnectionStrings:DefaultConnection` in `Api/appsettings.json`.
- **Api**: controllers stay thin and forward calls to services. Routes are plural (`api/expenses`, `api/categories`) and use `{id:guid}` constraints. POST returns `CreatedAtAction`; PUT and DELETE return `204 NoContent`.

**Error handling:** to signal an error, throw `DomainException(message, statusCode = 400)` from the domain or a service, for example `404` when a record is not found. `DomainExceptionMiddleware` converts it into a `ProblemDetails` JSON response, so controllers never catch exceptions. The frontend reads `detail` or `title` from that response.

**Dates:** `DateTime` columns are PostgreSQL `timestamptz`, so values must be `Kind=Utc`. The frontend turns user-entered `YYYY-MM-DD` values into UTC ISO strings (`toUtcIso` in `frontend/services/api.ts`) before sending them.

CORS allows any origin (`AllowAll`). `WeatherForecastController` and the two `Class1.cs` files are template leftovers.

## Frontend architecture (`frontend/`)

`frontend/AGENTS.md` (imported by `frontend/CLAUDE.md`) holds frontend-specific rules. Before writing Expo code, read the versioned Expo v54 docs. Every mutation must give feedback through the global `useSnackbar()` (`context/SnackbarContext.tsx`) using the `snackbarColor` values from `constants/theme.ts`. Never create a local `<Snackbar>`.

Data flows through three layers:
- `services/api.ts` holds a single axios client and one typed function per endpoint. `BASE_URL` changes by platform (`localhost:5132` on web, `10.0.2.2:5132` on the Android emulator). A response interceptor converts errors into `ApiError(message, status)`.
- `hooks/useExpenses.ts` and `hooks/useCategories.ts` wrap TanStack Query. Each hook returns the query data plus `create`, `update` and `remove` mutations, and every mutation invalidates the root query key (`['expenses']` or `['categories']`) on success. Screens use these hooks and never call `api` directly.
- `types/` contains TypeScript types that mirror the backend DTOs.

**Provider order in `App.tsx`:** SafeArea → QueryClient → Paper (`theme` from `constants/theme.ts`) → Snackbar → ActiveRoute → NavigationContainer. The app waits for the Inter fonts to load before hiding the splash screen.

**Navigation and layout:** there is one native stack (`navigation/RootNavigator.tsx`, headers hidden) with the routes Expenses, Categories, Dashboard and Chat. `AppShell` shows a `Sidebar` when the window is at least 768px wide and a `BottomNav` otherwise. Both navigate through the global `navigationRef` and highlight the current route using `ActiveRouteContext`, which `NavigationContainer` updates on each state change. To add a screen, update `navigation/types.ts`, `RootNavigator` and `hooks/useNavItems.ts`.

**UI:** built with react-native-paper (MD3) and lucide icons from `constants/icons.tsx`. Colors come from `constants/theme.ts` (`customColors`) and `constants/categoryColors.ts`. Masked inputs use `hooks/useCurrencyInput.ts`, `hooks/useDateInput.ts` and `components/DateInput.tsx`.

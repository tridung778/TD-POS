# RetailFlow POS — AI Development Instructions

## 1. Project Overview

RetailFlow POS is a modern Point of Sale and Retail Management System designed for small and medium-sized retail stores.

The system supports:

- Point of Sale operations
- Product and category management
- Inventory management
- Orders and payments
- Cashier shifts
- Customer management
- Supplier management
- Sales reports
- Role-based access control
- Audit logging

The project is built as a **TypeScript monorepo** using Next.js for both frontend and backend applications.

The architecture follows a **Modular Monolith** approach rather than microservices.

---

## 2. Core Objectives

The system must prioritize:

1. Data consistency
2. Inventory accuracy
3. Transaction safety
4. Maintainable architecture
5. Strong type safety
6. Clear separation of concerns
7. Good developer experience
8. Production-like code quality

Do not implement features as simple CRUD if they involve business logic, inventory, payment, or financial data.

---

## 3. Technology Stack

### Monorepo

- pnpm
- Turborepo
- TypeScript
- Node.js 22 LTS

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod

### Backend

- Next.js API application
- TypeScript
- Modular Monolith architecture
- Service Layer
- Repository Layer
- Zod validation
- REST API

### Database

- PostgreSQL
- Prisma ORM
- Prisma Migrate
- UUID primary keys

### Infrastructure

- Redis
- BullMQ
- Docker
- Docker Compose

### Authentication

- Auth.js or custom session-based authentication
- Argon2 password hashing
- Role-Based Access Control

### Testing

- Vitest
- Playwright
- Testcontainers PostgreSQL

### Code Quality

- ESLint
- Prettier
- Husky
- lint-staged
- TypeScript strict mode

### Observability

- Pino
- Sentry

---

## 4. Repository Structure

```text
retailflow-pos/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── stores/
│   │
│   ├── api/
│   │   ├── app/
│   │   │   └── api/
│   │   │       └── v1/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── inventory/
│   │   │   ├── customers/
│   │   │   ├── suppliers/
│   │   │   ├── shifts/
│   │   │   └── reports/
│   │   ├── lib/
│   │   └── middleware.ts
│   │
│   └── worker/
│       ├── jobs/
│       ├── processors/
│       └── queues/
│
├── packages/
│   ├── ui/
│   ├── db/
│   ├── auth/
│   ├── validation/
│   ├── types/
│   ├── utils/
│   ├── config-eslint/
│   └── config-typescript/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── docker/
├── docs/
├── tests/
├── .env.example
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── CLAUDE.md
```

---

## 5. Architecture Principles

### 5.1 Modular Monolith

The backend must remain a modular monolith.

Do not introduce microservices unless explicitly requested.

Each business domain should be isolated into its own module.

Example:

```text
modules/orders/
├── order.controller.ts
├── order.service.ts
├── order.repository.ts
├── order.schema.ts
├── order.types.ts
└── order.mapper.ts
```

---

### 5.2 Separation of Concerns

Use the following flow:

```text
HTTP Request
    ↓
Route Handler / Controller
    ↓
Validation
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL
```

Responsibilities:

#### Route Handler

- Parse request
- Authenticate request
- Validate input
- Call service
- Return response

Must not contain complex business logic.

#### Service

- Business rules
- Transaction orchestration
- Permission-sensitive operations
- Inventory and payment logic

#### Repository

- Database queries
- Prisma operations
- Query composition

#### Schema

- Zod request validation
- Input constraints

---

## 6. Coding Rules

### General

- Use TypeScript everywhere.
- Enable strict TypeScript.
- Avoid `any`.
- Prefer explicit types for public functions.
- Use async/await.
- Avoid deeply nested functions.
- Keep functions focused.
- Prefer readable code over clever code.
- Do not duplicate business logic.

### Naming

Use:

```text
camelCase       variables/functions
PascalCase      classes/components/types
UPPER_SNAKE_CASE constants/enums
kebab-case      route paths
```

Examples:

```ts
createOrder()
getProductByBarcode()
OrderStatus
MAX_CART_ITEMS
```

---

### Avoid

```ts
const data: any = ...
```

```ts
// Business logic inside route
export async function POST(req: Request) {
  const body = await req.json();

  // 100 lines of business logic
}
```

Prefer:

```ts
export async function POST(req: Request) {
  const body = createOrderSchema.parse(await req.json());

  const result = await orderService.createOrder(body);

  return Response.json(result);
}
```

---

## 7. Frontend Architecture

The frontend uses feature-based organization.

```text
apps/web/
├── app/
├── components/
├── features/
│   ├── pos/
│   ├── products/
│   ├── orders/
│   ├── inventory/
│   ├── customers/
│   └── reports/
├── hooks/
├── lib/
└── stores/
```

Each feature should contain its own:

```text
features/products/
├── components/
├── hooks/
├── api.ts
├── schemas.ts
├── types.ts
└── utils.ts
```

### State Management

Use:

- TanStack Query for server state
- Zustand for local client state
- React Hook Form for forms

Do not use Zustand as a replacement for server-state caching.

---

## 8. API Rules

All APIs should use versioned routes:

```text
/api/v1/...
```

Examples:

```text
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id

POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/:id

POST   /api/v1/orders/:id/payment
POST   /api/v1/orders/:id/cancel

GET    /api/v1/inventory
POST   /api/v1/inventory/adjustments

POST   /api/v1/shifts/open
POST   /api/v1/shifts/:id/close
```

### API Response Format

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

Do not expose raw database errors to clients.

---

## 9. Database Rules

### Primary Keys

Use UUID for primary keys.

### Timestamps

All major entities should include:

```text
id
createdAt
updatedAt
```

Use UTC timestamps in the database.

### Money

Never use floating-point numbers for money.

Prefer:

- PostgreSQL `numeric`
- Prisma `Decimal`

Example:

```prisma
price Decimal @db.Decimal(12, 2)
```

Never:

```ts
const total = 10.5 + 20.3;
```

for financial calculations without proper decimal handling.

---

## 10. Critical Business Rules

### 10.1 Inventory Consistency

Inventory quantity must never be modified casually from multiple unrelated places.

All stock changes must create an inventory transaction/ledger record.

Examples:

```text
PURCHASE
SALE
RETURN
ADJUSTMENT
TRANSFER
VOID
```

---

### 10.2 Order Creation

Creating an order must:

1. Validate products
2. Validate quantities
3. Check product availability
4. Calculate subtotal
5. Calculate discount
6. Calculate tax
7. Calculate total
8. Create order
9. Create order items
10. Deduct inventory
11. Create inventory ledger
12. Commit transaction

---

### 10.3 Inventory Race Conditions

When deducting stock, use a database transaction.

For critical inventory operations, use row-level locking or atomic updates.

Example concept:

```sql
SELECT *
FROM inventory
WHERE product_id = $1
FOR UPDATE;
```

Never trust frontend stock quantity.

The backend must always re-check stock.

---

### 10.4 Payment

Payment must not be marked successful before the order transaction is safely completed.

Supported payment methods:

```text
CASH
BANK_TRANSFER
CARD
QR_CODE
```

Payment status:

```text
PENDING
PAID
FAILED
REFUNDED
PARTIALLY_REFUNDED
```

---

### 10.5 Order Status

Recommended statuses:

```text
DRAFT
PENDING_PAYMENT
PAID
COMPLETED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
```

Do not allow arbitrary status transitions.

---

## 11. Cashier Shift Rules

A cashier can have only one active shift at a time.

Shift lifecycle:

```text
OPEN
    ↓
ACTIVE
    ↓
CLOSED
```

Opening a shift requires:

- Cashier ID
- Opening cash
- Opening timestamp

Closing a shift must calculate:

```text
Expected Cash
Actual Cash
Cash Difference
Total Sales
Cash Sales
Non-Cash Sales
```

Cash difference must be recorded for auditing.

---

## 12. Roles and Permissions

Default roles:

```text
OWNER
ADMIN
MANAGER
CASHIER
INVENTORY_STAFF
```

Example permissions:

```text
product:read
product:create
product:update
product:delete

order:create
order:read
order:cancel
order:refund

inventory:read
inventory:adjust
inventory:import

report:read
employee:manage
shift:open
shift:close
```

Authorization must be enforced on the backend.

Frontend permission checks are only for UI visibility.

---

## 13. Transactions

Use Prisma transactions for operations involving multiple related writes.

Example:

```ts
await prisma.$transaction(async (tx) => {
  // Create order
  // Create order items
  // Update inventory
  // Create inventory ledger
  // Create payment
});
```

Do not perform critical multi-step financial operations without a transaction.

---

## 14. Error Handling

Use domain-specific errors.

Examples:

```text
ProductNotFoundError
InsufficientStockError
OrderNotFoundError
InvalidOrderStatusError
ShiftAlreadyOpenError
PaymentFailedError
UnauthorizedError
ForbiddenError
```

Do not throw generic errors everywhere:

```ts
throw new Error("Something went wrong");
```

Prefer meaningful errors:

```ts
throw new InsufficientStockError(productId);
```

---

## 15. Validation

All external input must be validated using Zod.

Validate:

- Request body
- Query parameters
- Route parameters
- Pagination
- Filters
- Product prices
- Quantities
- Payment data

Never trust frontend validation alone.

---

## 16. Pagination

All list APIs should support pagination.

Example:

```text
?page=1&limit=20
```

Response:

```json
{
  "items": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Use reasonable maximum limits.

Example:

```text
MAX_PAGE_SIZE = 100
```

---

## 17. Security Rules

- Never store plaintext passwords.
- Use Argon2 for password hashing.
- Never expose secrets to frontend.
- Validate all user input.
- Use rate limiting for authentication endpoints.
- Do not trust role information from the client.
- Do not expose stack traces in production.
- Use secure cookies for sessions.
- Protect sensitive endpoints with authorization.
- Avoid SQL injection by using Prisma parameterized queries.
- Do not log passwords, tokens, or payment-sensitive information.

---

## 18. Redis Usage

Redis may be used for:

- Product search caching
- Rate limiting
- Session-related caching
- Background job queues
- Temporary POS data
- Distributed locks where necessary

Do not cache highly mutable inventory data without a clear invalidation strategy.

---

## 19. Background Jobs

Use BullMQ for asynchronous tasks.

Examples:

```text
Send receipt
Generate daily report
Update analytics
Low-stock notification
Export sales report
Cleanup expired sessions
```

Background jobs must be idempotent whenever possible.

---

## 20. Testing Rules

### Unit Tests

Test:

- Price calculations
- Discount calculations
- Tax calculations
- Inventory rules
- Permission rules
- Shift calculations

### Integration Tests

Test:

- Order creation
- Inventory deduction
- Payment flow
- Transaction rollback
- Role authorization

### E2E Tests

Critical flows:

```text
Login
Open cashier shift
Search product
Add product to cart
Complete payment
Verify inventory deduction
Close shift
View sales report
```

Do not only test successful cases.

Also test:

- Insufficient stock
- Invalid payment
- Unauthorized access
- Duplicate requests
- Cancelled orders
- Transaction rollback

---

## 21. Git Commit Convention

Use Conventional Commits.

Examples:

```text
feat: add product management
feat: implement cashier shift closing
fix: prevent overselling inventory
refactor: extract order service
test: add inventory transaction tests
docs: update API documentation
chore: update dependencies
```

---

## 22. Development Workflow

Before implementing a feature:

1. Understand the existing architecture.
2. Inspect related modules.
3. Check database schema.
4. Check existing shared packages.
5. Reuse existing utilities.
6. Identify business rules.
7. Plan database changes.
8. Implement backend first if necessary.
9. Implement frontend.
10. Add tests.
11. Run typecheck.
12. Run lint.
13. Run tests.

Do not blindly create duplicate utilities or modules.

---

## 23. Database Migration Workflow

When changing the database:

1. Update Prisma schema.
2. Create migration.
3. Review generated SQL.
4. Update seed data if necessary.
5. Update related services.
6. Update tests.

Never manually modify production database structure without a migration.

---

## 24. Environment Variables

Use `.env.example`.

Example:

```env
DATABASE_URL=
DIRECT_URL=

REDIS_URL=

AUTH_SECRET=
AUTH_URL=

NEXT_PUBLIC_API_URL=

SENTRY_DSN=

NODE_ENV=development
```

Rules:

- Never commit `.env`.
- Never expose private environment variables with `NEXT_PUBLIC_`.
- Keep secrets out of source code.

---

## 25. UI/UX Guidelines

The POS interface must prioritize speed and usability.

Important principles:

- Fast product search
- Keyboard-friendly workflow
- Barcode scanner support
- Clear cart state
- Large payment buttons
- Minimal unnecessary navigation
- Responsive layout
- Clear stock warnings
- Clear payment status
- Confirmation for destructive actions

The POS screen should feel like a real cashier application, not a generic admin dashboard.

---

## 26. Performance Guidelines

- Use pagination for large datasets.
- Avoid unnecessary database queries.
- Avoid N+1 queries.
- Use Prisma `select` when appropriate.
- Cache read-heavy stable data.
- Debounce product search.
- Use optimistic UI only when safe.
- Do not overuse React Server Components or client components unnecessarily.
- Avoid loading entire product catalogs into the browser.

---

## 27. AI Coding Assistant Rules

When modifying the codebase:

### Always

- Read relevant files before editing.
- Follow existing patterns.
- Reuse shared packages.
- Preserve type safety.
- Consider transaction boundaries.
- Consider authorization.
- Consider error handling.
- Add tests for important business logic.
- Explain breaking changes.
- Keep changes focused.

### Never

- Rewrite unrelated files.
- Introduce unnecessary dependencies.
- Add microservices without approval.
- Bypass validation.
- Trust frontend authorization.
- Update inventory without ledger records.
- Use floating-point arithmetic for money.
- Remove tests to make builds pass.
- Ignore TypeScript errors.
- Hardcode secrets.
- Create duplicate database models.
- Add business logic directly into UI components.

---

## 28. Definition of Done

A feature is considered complete only when:

- Backend API implemented
- Input validation added
- Authorization handled
- Business logic placed in service layer
- Database migration added if needed
- Error handling implemented
- Frontend integrated
- Loading and error states handled
- Tests added for critical logic
- TypeScript passes
- ESLint passes
- No unrelated changes introduced

---

## 29. Project Development Priority

Recommended implementation order:

### Phase 1 — Foundation

- Monorepo setup
- Next.js apps
- Shared packages
- PostgreSQL
- Prisma
- Authentication
- RBAC

### Phase 2 — Catalog

- Products
- Categories
- Brands
- Product variants
- Barcode

### Phase 3 — Inventory

- Stock management
- Inventory ledger
- Stock adjustments
- Low-stock alerts

### Phase 4 — POS

- Cart
- Product search
- Order creation
- Payment
- Receipt

### Phase 5 — Cashier Operations

- Open shift
- Cash transactions
- Close shift
- Cash reconciliation

### Phase 6 — Management

- Customers
- Suppliers
- Purchase orders
- Returns
- Reports

### Phase 7 — Advanced

- Redis caching
- BullMQ jobs
- Realtime updates
- Audit logs
- Advanced analytics
- E2E testing
- Deployment

---

## 30. Final Principle

RetailFlow POS is not just a CRUD application.

The most important parts of the system are:

1. Correct financial calculations
2. Accurate inventory
3. Safe transactions
4. Reliable authorization
5. Maintainable modular architecture
6. Good user experience for cashiers

When in doubt, prioritize **data integrity and business correctness over implementation speed**.
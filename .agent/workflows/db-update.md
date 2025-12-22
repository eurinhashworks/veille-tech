---
description: Workflow for updating the database schema with Prisma
---

# Workflow: Database Updates (Prisma)

Follow these steps when modifying the database structure.

1. **Schema Modification**:
   - Update `prisma/schema.prisma` with the new models or fields.
   - Ensure all relations are correctly defined.

// turbo
2. **Generate Client**:
   - Run `npx prisma generate` to update the Prisma Client types.

3. **Migration**:
   - Run `npx prisma migrate dev --name <migration_name>` to apply changes locally.
   - Verify that the migration script looks correct.

4. **Seed Updates (Optional)**:
   - If new data is required for development, update `prisma/seed.ts` (if it exists).
   - Run `npx prisma db seed` to populate the database.

5. **Service Integration**:
   - Update any services in `services/` or `api/` that depend on the modified models.
   - Ensure TypeScript types are updated throughout the codebase.

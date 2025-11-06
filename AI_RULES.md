# AI Rules for ORBITTA

## Tech Stack Overview

• **Frontend Framework**: React 18 with TypeScript for type-safe development
• **Routing**: React Router v6 for client-side navigation
• **State Management**: React Context API for global state, TanStack Query (React Query) for server state
• **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
• **Styling**: Tailwind CSS for utility-first styling with custom design system
• **Data Visualization**: Recharts for dashboard charts and graphs
• **Forms**: React Hook Form with Zod for validation
• **Authentication**: Supabase Auth integration through custom AuthContext
• **Backend**: Supabase Platform (PostgreSQL database with Edge Functions)
• **Testing**: Vitest for unit tests with React Testing Library

## Library Usage Rules

### UI Components
- **Primary Choice**: Use shadcn/ui components whenever available
- **Custom Components**: Create new components in `src/components` when shadcn/ui doesn't have what you need
- **Styling**: Always use Tailwind CSS classes for styling, never plain CSS unless absolutely necessary
- **Icons**: Use Lucide React icons exclusively

### State Management
- **Global State**: Use React Context API through `src/context/*` files
- **Server State**: Use TanStack Query for all data fetching and caching
- **Form State**: Use React Hook Form for all forms with Zod for validation

### Data Visualization
- **Charts**: Use Recharts for all data visualization needs
- **Chart Components**: Create reusable chart components in `src/charts/` directory
- **Data Processing**: Process data in components/pages before passing to chart components

### Routing
- **Route Management**: Use React Router v6 declarative routing
- **Route Protection**: Use `src/components/ProtectedRoute.tsx` for role-based access control
- **Navigation**: Use `useNavigate` hook for programmatic navigation

### Data Handling
- **API Calls**: All Supabase interactions should go through TanStack Query hooks
- **Types**: Define all data types in `src/types/mer.ts` following the MER model
- **Mock Data**: Use `src/data/mockData.ts` for static reference data
- **Templates**: Store evaluation templates in `src/data/evaluationTemplates.ts`

### Authentication
- **Auth State**: Always access user data through `useAuth` hook
- **Protected Routes**: Wrap protected pages with `ProtectedRoute` component
- **Role Checks**: Use role-based conditional rendering with `profile?.role`

### Forms and Validation
- **Form Library**: Use React Hook Form for all forms
- **Validation**: Use Zod for all form validation schemas
- **Form Components**: Create reusable form components in `src/components/ui/form.tsx`

### Testing
- **Test Framework**: Use Vitest for unit tests
- **Test Utilities**: Use React Testing Library for component testing
- **Test Location**: Place test files next to the components they test with `.test.tsx` extension

### File Structure Rules
- **Pages**: All route pages go in `src/pages/`
- **Components**: Reusable UI components in `src/components/`
- **Charts**: Reusable chart components in `src/charts/`
- **Context**: Global context providers in `src/context/`
- **Hooks**: Custom hooks in `src/hooks/`
- **Lib**: Utility functions in `src/lib/`
- **Services**: Business logic services in `src/services/`
- **Types**: All TypeScript types in `src/types/`
- **Data**: Static data files in `src/data/`
- **Utils**: Helper functions in `src/utils/`
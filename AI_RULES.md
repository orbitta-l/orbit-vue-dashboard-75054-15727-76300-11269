# AI Rules for Orbitta Application Development

This document outlines the core technologies and best practices for developing the Orbitta application. Adhering to these rules ensures consistency, maintainability, and optimal performance.
qD!Bk^*1gIE^Sa
## Tech Stack Overview

The Orbitta application is built using a modern web development stack, focusing on performance, developer experience, and scalability.

*   **React**: The primary JavaScript library for building user interfaces.
*   **TypeScript**: The superset of JavaScript that adds static typing, enhancing code quality and maintainability.
*   **Vite**: A fast and efficient build tool for modern web projects.
*   **Tailwind CSS**: A utility-first CSS framework used for all styling, enabling rapid and consistent UI development.
*   **shadcn/ui**: A collection of reusable UI components built on Radix UI and styled with Tailwind CSS, providing accessible and customizable building blocks.
*   **React Router DOM**: The standard library for client-side routing in React applications.
*   **Supabase**: Our Backend as a Service (BaaS) solution, handling authentication, database management, and serverless Edge Functions.
*   **TanStack Query**: A powerful data-fetching library for managing server state, caching, and synchronization.
*   **Recharts**: A composable charting library built with React and D3, used for all data visualizations.
*   **Zod & React Hook Form**: Libraries for robust form validation and management.
*   **Lucide React**: A comprehensive icon library for all visual iconography.

## Library Usage Rules

To maintain a clean, efficient, and consistent codebase, please follow these guidelines for library usage:

*   **UI Components**: Always prioritize `shadcn/ui` components for building the user interface. If a specific `shadcn/ui` component doesn't meet a requirement, create a new component in `src/components/` rather than modifying the `src/components/ui/` files directly.
*   **Styling**: All styling must be done using **Tailwind CSS** utility classes. Avoid writing custom CSS unless absolutely necessary for complex animations or specific overrides not achievable with Tailwind.
*   **Routing**: Use **React Router DOM** for all navigation within the application. Keep the main route definitions in `src/App.tsx`.
*   **Icons**: All icons should be imported from **`lucide-react`**.
*   **Data Visualization**: For all charts and graphs, use **Recharts**.
*   **Form Management & Validation**: Use **React Hook Form** for managing form state and **Zod** for schema-based validation.
*   **Backend Interaction**: All backend operations (authentication, database queries, Edge Function calls) must be handled via **Supabase**.
*   **Data Fetching & Caching**: Utilize **TanStack Query** for fetching, caching, and updating server data.
*   **Notifications**: For toast notifications, use the `sonner` library or the `shadcn/ui` `toast` component.
*   **Date Manipulation**: Use **`date-fns`** for all date formatting, parsing, and manipulation tasks.
*   **File Structure**:
    *   Pages should reside in `src/pages/`.
    *   Reusable components should be in `src/components/`.
    *   Chart-specific components should be in `src/charts/`.
    *   Utility functions should be in `src/utils/`.
    *   Custom React hooks should be in `src/hooks/`.
    *   Always create a new file for each new component or hook, no matter how small.



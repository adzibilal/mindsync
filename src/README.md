# Struktur Folder Source (src/)

Dokumentasi struktur folder untuk project MindSync yang mengikuti best practice Next.js dengan TypeScript.

## 📁 Struktur Folder

```
src/
├── app/              # Next.js App Router (pages, layouts, routes)
├── components/       # React components
├── types/           # TypeScript type definitions & interfaces
├── store/           # Global state management (Zustand/Redux)
├── hooks/           # Custom React hooks
├── utils/           # Utility & helper functions
├── constants/       # Application constants & enums
├── services/        # API services & business logic layer
├── context/         # React Context providers
├── styles/          # Shared styles & theme configuration
└── lib/             # Third-party library configurations
```

## 📝 Deskripsi Folder

### `app/`
Folder Next.js App Router yang berisi:
- Pages (page.tsx)
- Layouts (layout.tsx)
- API routes
- Loading & error states
- Metadata configuration

### `components/`
Komponen React yang dapat digunakan kembali:
- UI components
- Feature components
- Shared components
- Layout components

### `types/`
TypeScript type definitions:
- Interface definitions
- Type aliases
- API response types
- Props types

### `store/`
Global state management:
- Store configuration
- Actions & reducers
- State slices
- Selectors

### `hooks/`
Custom React hooks:
- Data fetching hooks
- State management hooks
- Utility hooks
- Business logic hooks

### `utils/`
Utility functions:
- Helper functions
- Data transformations
- Formatters
- Validators

### `constants/`
Application constants:
- API endpoints
- Route paths
- Configuration values
- Enums & static data

### `services/`
Service layer:
- API client configuration
- HTTP request handlers
- External service integrations
- Business logic services

### `context/`
React Context providers:
- Global context providers
- Theme context
- Auth context
- Feature-specific contexts

### `styles/`
Shared styles:
- Theme configuration
- CSS modules
- Style utilities
- Animation definitions

### `lib/`
Third-party library configurations:
- Library setup & initialization
- Custom configurations
- Wrappers & adapters

## 🎯 Best Practices

1. **Separation of Concerns**: Pisahkan business logic dari UI components
2. **Reusability**: Buat komponen dan fungsi yang dapat digunakan kembali
3. **Type Safety**: Gunakan TypeScript untuk semua definisi type
4. **Naming Convention**: Gunakan PascalCase untuk components, camelCase untuk functions
5. **File Organization**: Kelompokkan file berdasarkan feature atau functionality
6. **Index Files**: Gunakan index file untuk export yang lebih clean

## 📚 Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [React Best Practices](https://react.dev/)
- [TypeScript Guidelines](https://www.typescriptlang.org/docs/)


# Product Management App

A modern React application built with TypeScript and PrimeReact for managing products with full CRUD operations. This application uses the Fake Store API for authentication and product management.

## Features

- **User Authentication**: Secure login using Fake Store API
- **Product Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Responsive Design**: Mobile-friendly interface using PrimeReact components
- **Pagination**: Load more functionality for better performance
- **Local State Management**: Changes persist locally until reset
- **Form Validation**: Comprehensive client-side validation
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and retry options
- **Toast Notifications**: Real-time feedback for user actions

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **UI Library**: PrimeReact with PrimeIcons
- **Styling**: Custom CSS with modern design principles
- **API**: Fake Store API for data operations
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Build Tool**: Create React App
- **Package Manager**: npm/yarn

## Prerequisites

Before running this application, make sure you have:

- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ShridharS19/react-assignment.git
cd product-management-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Development Server

```bash
npm start
# or
yarn start
```

The application will open automatically in your default browser at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

## Authentication

To access the application, use the following demo credentials:

- **Username**: `mor_2314`
- **Password**: `83r5^_`

These credentials are provided by the Fake Store API for testing purposes.

## How to Use

### Login
1. Open the application in your browser
2. Enter the demo credentials provided above
3. Click "Sign In" to authenticate

### Managing Products

#### Viewing Products
- All products are displayed in a responsive grid layout
- Each product card shows image, title, description, price, and rating
- Products load with pagination (6 products per page)
- Click "Load More Products" to fetch additional products

#### Adding a New Product
1. Click the "Add Product" button in the header
2. Fill in all required fields:
   - **Title**: Product name (minimum 3 characters)
   - **Price**: Product price (must be greater than 0)
   - **Category**: Select from available categories
   - **Description**: Product description (minimum 10 characters)
   - **Image URL**: Valid image URL for the product
3. Click "Create" to add the product

#### Editing a Product
1. Click the "Edit" button on any product card
2. Modify the desired fields in the form
3. Click "Update" to save changes

#### Deleting a Product
1. Click the "Delete" button on any product card
2. Confirm the deletion in the popup dialog
3. The product will be removed from the list

#### Resetting Data
- Click the refresh icon in the header to reset all local changes
- This will restore the original data from the API

### Logout
- Click the logout icon in the header to sign out
- You'll be redirected back to the login page

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation header with user info
│   ├── Header.css          # Header styling
│   ├── LoginPage.tsx       # Authentication page
│   ├── LoginPage.css       # Login page styling
│   ├── ProductList.tsx     # Main products display
│   ├── ProductList.css     # Product list styling
│   ├── ProductForm.tsx     # Add/Edit product form
│   ├── ProductForm.css     # Product form styling
│   └── Footer.tsx          # Footer component
├── hooks/
│   ├── useAuth.ts          # Authentication logic
│   └── useProducts.ts      # Product management logic
├── types.ts                # TypeScript type definitions
├── api.ts                  # API service functions
├── App.tsx                 # Main application component
├── App.css                 # Global application styles
├── index.tsx               # Application entry point
└── index.css               # Global CSS styles
```

## API Endpoints

The application uses the following Fake Store API endpoints:

- **Authentication**: `POST https://fakestoreapi.com/auth/login`
- **Get Products**: `GET https://fakestoreapi.in/api/products?page={page}&limit={limit}`
- **Add Product**: `POST https://fakestoreapi.com/products`
- **Update Product**: `PUT https://fakestoreapi.com/products/{id}`
- **Delete Product**: `DELETE https://fakestoreapi.com/products/{id}`

##  Local Storage

The application uses local storage to persist:
- Authentication token and user data
- Added products (locally created)
- Modified products (local changes)
- Deleted product IDs (to filter from API data)

## Deployment

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)
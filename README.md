# Aximart Ecommerce App

## Overview

Aximart is a full-stack e-commerce application built with React, Node.js, Express, and MongoDB. It provides a platform for users to browse products, add them to their cart, and make purchases. The application also includes an admin panel for managing products and orders.

## Features

- User authentication and authorization
- Product listing and details
- Shopping cart functionality
- Order management
- Admin panel for product and order management
- Responsive design

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/anggamys/aximart.git
   ```

2. Navigate to the project directory:

   ```bash
   cd aximart
   ```

3. Install dependencies for both client and server:

   ```bash
   npm install
   ```

## Usage

1. Configure environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   MONGODB_URI=
   NEXTAUTH_URL=
   NEXTAUTH_SECRET=
   CLOUDINARY_SECRET=
   NEXT_PUBLIC_CLOUDINARY_API_KEY=
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

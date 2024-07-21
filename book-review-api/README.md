# CRUD API Project

## Summary

This is a GraphQL API for a book review system built with Node.js, TypeScript, Apollo Server, and Prisma. The API allows authenticated users to perform various operations on books and reviews.

## Technologies Used

- Node.js
- TypeScript
- Apollo Server
- Postgresql
- Prisma
- JWT for authentication

## Features

- User authentication using JSON Web Tokens (JWT)
- CRUD operations for books and reviews
- GraphQL schema with queries and mutations
- Prisma ORM for PostgreSQL database interaction

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Yarn or npm (package managers)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/book-review-api.git
   cd book-review-api

2. **Install dependencies:**
    yarn install
    or
    npm install

3. **Configuration**
    Create a .env file in the root directory of the project and add the following environment variables:

    DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
    JWT_SECRET="your_jwt_secret_key"

    Replace username, password, and your_jwt_secret_key with your PostgreSQL credentials and a secret key for JWT.

    Set up the database:

    Run the following command to create the database schema:
    npx prisma migrate dev --name init

4. **Running the Application**
    yarn dev
    or
    npm run dev
    The server will start on http://localhost:4000.

5.  **API Endpoints**
(i) getBooks : To retrieve data from book table.
    query {
        getBooks{
            id
            title
            author
            publishedYear
        }
    }

(ii) getBook : To get data for a specific book.
    query {
        getBook(id: 2){
            id
            title
            author
            publishedYear
        }
    }

(iii) addBook : To add data for a new Book.
    mutation {
        addBook(title: "New Book", author: "XYZU", publishedYear: 2024) {
            id
            title
            author
            publishedYear
        }
    }

(iv) register : To register a new User.
    mutation {
        register(username: "pratibha", email: "pratibha@gmail.com", password: "password123") {
            id
            username
            email
        }
    }

(v) login : To login and get a JWT token for authentication purpose.
    mutation {
        login(email: "pratibha@gmail.com", password: "password123")
    }

(vi) addReview : To add review for a particular book using bookId.
    mutation {
        addReview(bookId: 1, rating: 5, comment: "Great book!") {
            id
            book{
                id
            }
            rating
            comment
            createdAt
        }
    }

(vii) getMyReviews : To get all reviews submitted till now.
    query {
        getMyReviews {
            id
            book{
                id
            }
            rating
            comment
            createdAt
        }
    }

(viii) getReviews : To get reviews for a particular book id.
    query {
        getReviews(bookId: 1) {
            id
            user{
                id
            }
            rating
            comment
            createdAt
        }
    }

(ix) updateReview : To update a review for a particular book.
    mutation {
        updateReview(reviewId: 4, rating: 4, comment: "Updated review") {
            id
            rating
            comment
        }
    }

(x) deleteReview : To delete a review.
    mutation {
        deleteReview(reviewId: "4")
    }


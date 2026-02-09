# 🎬 Movie Management API

A robust RESTful API built with **Node.js**, **Express**, and **Prisma ORM** for managing movie catalogs. This project implements strict business rules, data validation, and advanced filtering capabilities.

## Features

- **Full CRUD**: Create, Read, Update, and Delete movies.
- **Advanced Filtering**: Search by title, genre, rating, duration, and availability.
- **Strict Validations**: Ensures data integrity through custom business logic.
- **Database Integration**: Powered by Prisma ORM for seamless PostgreSQL/MySQL communication.

---

## 🛠️ Technical Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **ORM:** Prisma
* **Database:** PostgreSQL (or your preferred SQL DB)
* **Validation:** Custom Middleware & Controller Logic

---

## 📋 Business Rules & Constraints

To ensure high-quality data, the API enforces the following rules:

| Field | Constraint |
| :--- | :--- |
| **Title** | Required, minimum 3 characters, and must be **unique**. |
| **Duration** | Must be a **positive integer** and cannot exceed **300 minutes**. |
| **Genre** | Must be one of: *Action, Drama, Comedy, Horror, Romance, Animation, Sci-Fi, Thriller*. |
| **Rating** | Must be a decimal number between **0 and 10**. |
| **Description** | (Optional) Recommended minimum of 10 characters. |

---

## 🔍 API Endpoints & Filtering

### 1. Get All Movies (with Filters)
`GET /movies`

You can combine multiple query parameters to refine your search:

* `title`: Case-insensitive partial search (e.g., `?title=soul`).
* `genre`: Filter by category (e.g., `?genre=Drama`).
* `minRating`: Minimum rating threshold (e.g., `?minRating=8.5`).
* `maxDuration`: Maximum length in minutes (e.g., `?maxDuration=120`).
* `available`: Filter by availability status (`?available=true` or `false`).

**Example Request:**
```http
GET /movies?title=interstellar&minRating=9&available=true

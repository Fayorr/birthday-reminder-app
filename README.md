***

# 🎂 Automated Birthday Reminder App

A robust, automated backend service built to replace manual spreadsheet checking with a streamlined, "set-it-and-forget-it" birthday notification system. This application allows businesses to easily input customer birthdates and automatically sends personalized, HTML-templated congratulatory emails to celebrants at 7:00 AM daily.

## ✨ Features

* **Simple UI Interface:** A clean, server-side rendered (EJS) web form to collect and save customer details (Username, Email, Date of Birth).
* **Automated Daily Cron Jobs:** A background process scheduled to run every day at exactly 7:00 AM (configured for `Africa/Lagos` timezone) to check for current birthdays.
* **Smart Leap Year Logic:** Automatically handles February 29th birthdays by delivering their emails on February 28th during non-leap years.
* **Automated Email Dispatch:** Uses Nodemailer to send visually styled, dynamic HTML emails to celebrants.
* **Duplicate Prevention:** API endpoints are protected against saving duplicate email entries.
* **Unit & Integration Tested:** Core business logic and API routes are covered by automated tests using Jest and Supertest.

## 🛠️ Tech Stack

* **Runtime Engine:** Node.js
* **Web Framework:** Express.js (Standard MVC Architecture)
* **Database:** MongoDB with Mongoose ODM
* **View Engine:** EJS (Embedded JavaScript templating)
* **Automation:** node-cron
* **Email Service:** Nodemailer
* **Testing:** Jest & Supertest

## 📂 Project Structure (MVC)

```text
/birthday-reminder-app
  ├── /config          # Database connection setup
  ├── /controllers     # Logic handling incoming requests and views
  ├── /models          # MongoDB schemas (User model)
  ├── /routes          # API endpoints mapping to controllers
  ├── /services        # Core business logic (Email delivery, Cron scheduling)
  ├── /views           # EJS templates (UI and Email templates)
  ├── /tests           # Unit and integration tests
  ├── app.js           # Express app configuration & middleware
  └── server.js        # Entry point and server initialization
```

## 🚀 Getting Started

### Prerequisites
* Node.js installed on your local machine
* A running instance of MongoDB (Local or Atlas)
* A Gmail account with an **App Password** generated (Standard passwords will not work for security reasons).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/birthday-reminder-app.git
   cd birthday-reminder-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your secure credentials. *(Note: This file is intentionally git-ignored).*
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/birthday-reminder-app
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will start running at `http://localhost:3000`, and the background cron jobs will initialize immediately.

## 🧪 Testing

This project includes a test suite to verify API behavior, database mocking, and time-based logic (like Leap Year calculations). 

To run the tests, execute:
```bash
npm test
```

## 👨‍💻 Author

**Fayokunmi Joshua Osho**
* Full Stack Software Developer / Frontend Engineer 

## 📝 License
This project is open-source and available under the MIT License.
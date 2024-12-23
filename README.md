# Queue Management System

This project is a **Queue Management System** built using the following technologies:

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express.js
- **Payment Integration**: Razorpay for businesses that accept online payments

The system enables users to book available slots for businesses, with the option to make payments using Razorpay if supported by the business. It also includes features for real-time queue management and admin control over the queue and bookings.

## Features

- **Queue Management**: Businesses can manage their available slots and queues in real-time.
- **Booking Slots**: Users can view available slots and book them online.
- **Payment Integration**: Razorpay payment gateway integration for businesses accepting online payments.
- **User Authentication**: Sign up, login, and user-specific slot booking.
- **Real-Time Updates**: Users and businesses can see real-time updates on the queue status.
- **Admin Panel**: Admins can manage services, add slots, and track bookings.

## Project Structure

The project is divided into two main folders: **frontend** and **backend**.

## Technologies Used

- **Frontend**: React.js, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (for storing business and booking data)
- **Payment Gateway**: Razorpay
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

Follow the instructions below to set up and run the project locally.

### Prerequisites

Before you begin, ensure that you have the following installed:

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **npm**: Comes with Node.js

### Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>

   cd frontend
   npm install
   npm run dev
   cd backend
   npm install
   npm run dev
   ```

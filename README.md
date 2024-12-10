# Transcendence

This is our final project for 42 Singapore (core curriculum).
This is a platform where users can play pong.

Here are some of the features we implemented:
- AI opponent (with the restriction that the AI can only refresh its view of the game once per second and has to replicate human behavior)
- Game customizations
- User registration, user profiles, and friends functionality
- Dashboard to see game statistics
- Multiple languages (English, French, Spanish)
- Log management and analysis system using the ELK stack

## How to run

1. Make sure you have docker installed
2. Run
   ```
   docker-compose up --build
   ```
3. Go to https://localhost and have fun!

## Backend

The backend was all done by [@akolgano](https://github.com/akolgano)
The backend is written in Django.
We also used Docker and ELK.

## Frontend

The frontend was all done by [@barbayjuliette](https://github.com/barbayjuliette), except the dashboard [(@chinwenkai)](https://github.com/chinwenkai).
The frontend is written in vanilla JavaScript.
We used a simple library for translations, Chart.js for the dashboard, and Bootstrap for styling. 


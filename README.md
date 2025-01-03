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
2. Create a folder ~/data/backup
3. Run
   ```
   docker-compose up --build
   ```
4. Once it is ready, go to https://localhost and have fun!

## Backend

The backend was all done by [@akolgano](https://github.com/akolgano)
The backend is written in Django.
We also used Docker and ELK.

## Frontend

The frontend was all done by [@barbayjuliette](https://github.com/barbayjuliette), except the dashboard [(@chinwenkai)](https://github.com/chinwenkai).
The frontend is written in vanilla JavaScript.
We used a simple library for translations, Chart.js for the dashboard, and Bootstrap for styling. 


## Quick preview

Game registration
<img width="1436" alt="Screenshot 2025-01-03 at 11 51 29" src="https://github.com/user-attachments/assets/87715c89-7db1-4baf-be9f-3597201f96ac" />

Game (Against AI, with power-up option)
<img width="1440" alt="Screenshot 2025-01-03 at 11 54 11" src="https://github.com/user-attachments/assets/c54efaa1-3e4b-4444-939b-1e473328e909" />

Tournament
<img width="1434" alt="Screenshot 2025-01-03 at 12 02 26" src="https://github.com/user-attachments/assets/07731e52-5342-4460-9117-0b7876e859b4" />
<img width="1435" alt="Screenshot 2025-01-03 at 11 56 06" src="https://github.com/user-attachments/assets/37d4187f-a9af-49cb-9c47-8edd9ac8dd09" />
<img width="1439" alt="Screenshot 2025-01-03 at 11 59 57" src="https://github.com/user-attachments/assets/79c284e5-d3fd-4a5e-a396-545e8bdc2b16" />

Friends
<img width="1440" alt="Screenshot 2025-01-03 at 11 51 56" src="https://github.com/user-attachments/assets/519893ef-eed2-4560-b4ae-96e645831d90" />

Profile (with game and tournament history)
<img width="1439" alt="Screenshot 2025-01-03 at 11 52 08" src="https://github.com/user-attachments/assets/12f56bfb-fc87-4e16-9887-bab3eebcc0c1" />
<img width="1433" alt="Screenshot 2025-01-03 at 11 52 26" src="https://github.com/user-attachments/assets/85448ac2-16a2-4097-9664-47b345d2eb50" />

Dashboard
<img width="1439" alt="Screenshot 2025-01-03 at 11 52 39" src="https://github.com/user-attachments/assets/158b5e2d-bad3-4fe7-a72d-68b0b3c2c6e9" />

Account
<img width="1437" alt="Screenshot 2025-01-03 at 11 53 32" src="https://github.com/user-attachments/assets/21ef02c5-4fec-4cca-aace-a57798245231" />

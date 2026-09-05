# I-PARK: IoT Enabled Smart Parking System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Python](https://img.shields.io/badge/Made%20with-Python-1f425f.svg)](https://www.python.org/)
[![Raspberry Pi](https://img.shields.io/badge/Hardware-Raspberry%20Pi%204-red.svg)](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)
[![IoT Project](https://img.shields.io/badge/Project-IoT-6495ED.svg)](https://en.wikipedia.org/wiki/Internet_of_things)

## Table of Contents
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Hardware Implementation](#hardware-implementation)
- [Software Implementation](#software-implementation)
- [Results & Achievements](#results--achievements)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [References](#references)

## Project Overview

I-PARK is an IoT-enabled smart parking system designed to address urban parking challenges by providing real-time parking slot availability, electric vehicle (EV) charging support, dynamic pricing, and pre-booking capabilities. The system reduces the time drivers spend searching for parking, decreases traffic congestion and pollution, and improves overall parking efficiency.

**Developed by:** Nithya Shree P, Aishwarya Bhat, Meda Venkata Pranay Guptha, Prerana Srinath  
**Institution:** BMS Institute of Technology & Management  
**Affiliation:** Visvesvaraya Technological University, Belagavi  
**Academic Year:** 2025-2026  
**Degree:** Bachelor of Engineering in Electronics and Communication Engineering

## Problem Statement

Urban areas face severe parking challenges due to:
- Increasing number of vehicles without proportional increase in parking spaces
- Drivers spending excessive time circling for parking spots
- Resulting traffic congestion, fuel wastage, and increased air pollution
- Inadequate existing parking systems that lack:
  - Real-time slot availability information
  - EV charging infrastructure support
  - Dynamic pricing based on demand
  - Accessibility features for handicapped users
  - Pre-booking capabilities

## Objectives

1. **Real-time Slot Monitoring**: Create a sensor system that detects slot occupancy and transmits data to a central controller
2. **Mobile/Web Application**: Develop an interface displaying real-time slot status, enabling pre-booking, and guiding drivers to free spots
3. **Smart Features**: Implement EV charging compatibility, dynamic pricing, and fuel-saving route recommendations
4. **Scalability**: Design a low-cost, reliable system adaptable to various parking environments (malls, workplaces, public areas)
5. **Pre-booking System**: Allow users to reserve slots in advance to reduce last-minute stress

## System Architecture

I-PARK follows a four-layer architecture:

```
USER LAYER         → Mobile/Web App for booking, notifications, payments
                     Displays slot status, EV/handicap spots, pricing

IoT LAYER          → Ultrasonic/IR sensors at each slot detecting occupancy
                     Raspberry Pi/ESP32 collects and processes sensor data

CLOUD LAYER        → Data collection via MQTT/HTTP
                     Processing: Dynamic pricing, slot assignment, pre-booking
                     Storage: Slot history, bookings, pricing, user profiles

DASHBOARD LAYER    → Web/mobile dashboard showing real-time stats
                     Optional: LED indicators/barriers for physical slot status
```

![Block Diagram](documents/Fig%203.1:%20Block%20diagram%20for%20proposed%20methodology.png)

## Features

### Core Features
- **Real-time Slot Availability**: Instant updates on parking slot status (Free/Occupied)
- **Guaranteed Pre-booking**: Reserve specific time slots in advance with confirmation
- **Dynamic Pricing**: Rates adjust based on demand, time of day, and slot type
- **EV Infrastructure Control**: Dedicated slots with charging stations for electric vehicles
- **Handicapped Slot Reservation**: Priority allocation for approved vehicles
- **Real-time Status Integrity**: Accurate, instantaneous slot status display
- **Intuitive User Experience**: Easy slot selection, navigation, and payment process
- **Data Logging Foundation**: Secure recording of all bookings with timestamps and pricing
- **Automated Gate Control**: Servo-controlled barrier that opens for booked slots

### Technical Features
- **Sensor-based Detection**: IR/Ultrasonic sensors for accurate vehicle detection
- **Local Web Server**: Raspberry Pi hosts the web application without external backend
- **Frontend Technologies**: HTML, CSS, JavaScript with AJAX refresh for live updates
- **Backend Processing**: Python for GPIO control and sensor data handling
- **Communication Protocols**: MQTT or HTTP for sensor-to-server data transmission

## Hardware Implementation

### Components Used
- **Raspberry Pi 4 Model B**: Main controller hosting web server and processing logic
- **IR Sensors (3 units)**: Detect vehicle occupancy in each parking slot
- **Servo Motor (1 unit)**: Controls entry/exit gate for booked slots
- **Breadboard & Jumper Wires**: Prototyping and circuit connections
- **Power Supply**: 5V, 3A USB-C power adapter for Raspberry Pi
- **Storage**: MicroSD card (16-32 GB) for OS and project files
- **Display**: HDMI cable and monitor for initial setup and debugging

### Sensor Connections
```
IR Sensor VCC  → 5V (Pi)
IR Sensor GND  → GND (Pi)
IR Sensor OUT  → GPIO pins (e.g., GPIO17, GPIO27, GPIO22)

Servo Motor Signal → PWM GPIO pin (e.g., GPIO18)
Servo Motor Power  → External 5V supply
Servo Motor Ground → Shared with Pi ground
```

### Working Principle
- **Slot Detection**: IR sensors output:
  - `0` → Slot free (no vehicle detected)
  - `1` → Slot occupied (vehicle detected)
- **Data Processing**: Pi reads GPIO inputs every few seconds
- **Web Interface**: Local server serves HTML/CSS/JS pages
- **Gate Control**: Servo rotates to 90°/180° (open) on booking, returns to 0° (closed) after vehicle entry

## Software Implementation

### Frontend (Website)
- **Languages**: HTML5, CSS3, JavaScript ES6
- **Features**:
  - Real-time slot status display with color coding:
    - 🟢 Green = Free/Available
    - 🔴 Red = Occupied/Booked
  - Interactive slot selection for booking
  - Dynamic pricing display
  - EV/Handicapped slot indicators
  - Payment simulation interface
  - Admin panel for monitoring
- **Refresh Mechanism**: AJAX with `setInterval(2000)` for 2-second updates

### Backend (Raspberry Pi)
- **Language**: Python 3.x
- **Core Functions**:
  ```python
  # Sensor Reading
  slot_status = "Free" if GPIO.input(pin) == 0 else "Occupied"
  
  # Web Server (Simple HTTP or Flask)
  # Serves static files and handles booking requests
  
  # Servo Control
  # PWM signals to control gate position (0° = closed, 90°/180° = open)
  ```
- **Communication**: MQTT/HTTP client for data transmission to cloud (if implemented)
- **Data Handling**: Processes booking requests, updates slot status, controls hardware

### Database Options (for Cloud Implementation)
- **Firebase**: Real-time database for live slot status
- **SQLite**: Lightweight local database for prototyping
- **MySQL**: Relational database for production deployment
- **InfluxDB**: Time-series database for analytics and historical data

## Results & Achievements

### Hardware Results
✅ **Accurate Vehicle Detection**: IR sensors reliably detected vehicle presence  
✅ **Functional Gate Control**: Servo motor operated smoothly for entry/exit control  
✅ **Stable Raspberry Pi Operation**: Controller handled sensor I/O and web serving reliably  
✅ **Integrated System**: All hardware components worked cohesively in prototype  

### Software Results
✅ **Real-time Status Display**: Website showed instantaneous slot availability  
✅ **Pre-booking System**: Users could reserve slots with confirmed availability  
✅ **Dynamic Pricing**: System displayed variable rates based on simulated demand  
✅ **EV Slot Management**: Special handling for electric vehicle charging spots  
✅ **Data Logging**: Secure recording of booking transactions with timestamps  
✅ **User-friendly Interface**: Intuitive design for slot selection and payment  

### Key Validations
- **Hardware Model Verification**: All components functioned as designed
- **Software Model Proof**: 
  - Guaranteed pre-boking confirmed
  - Dynamic pricing validated across time periods
  - EV infrastructure control demonstrated
  - Real-time status integrity maintained
  - Intuitive user experience verified through testing

## Installation & Setup

### Prerequisites
- Raspberry Pi 4 Model B with power supply
- MicroSD card (16GB+ recommended)
- IR sensors (minimum 3)
- Servo motor
- Breadboard and jumper wires
- HDMI cable and monitor (for setup)
- USB keyboard and mouse (for initial configuration)

### Hardware Setup
1. **Prepare Raspberry Pi**:
   - Flash Raspberry Pi OS onto microSD card
   - Initial setup with monitor, keyboard, and mouse
   - Enable SSH and VNC for remote access (optional)

2. **Connect Sensors**:
   - Connect IR sensors to power, ground, and GPIO pins
   - Connect servo motor to power, ground, and PWM GPIO pin
   - Use breadboard for prototyping connections

3. **Physical Installation**:
   - Mount IR sensors at each parking slot entrance
   - Install servo motor to control entry/exit barrier
   - Ensure proper wiring and power distribution

### Software Setup
1. **Clone Repository** (if applicable):
```bash
git clone https://github.com/yourusername/i-park-smart-parking-system.git
cd i-park-smart-parking-system
```

2. **Install Dependencies**:
```bash
# Update system
sudo apt update && sudo apt upgrade

# Install Python packages
pip3 install RPi.GPIO flask paho-mqtt  # Adjust based on implementation

# Enable required interfaces
sudo raspi-config  # Enable SPI, I2C, GPIO if needed
```

3. **Configure System**:
   - Update GPIO pin numbers in Python script according to your wiring
   - Configure web server port and settings
   - Set up MQTT broker details if using cloud connectivity

4. **Run the Application**:
```bash
# Start the web server and sensor monitoring
python3 iPark_main.py  # or whichever your main script is named

# Access via browser at http://<raspberry-pi-ip-address>:<port>
```

## Usage

### For Drivers/Parking Users
1. **Access the System**: Connect to the local network and navigate to the Pi's IP address
2. **View Slot Availability**: See real-time status of all parking slots (green/red indicators)
3. **Book a Slot**:
   - Select an available (green) slot
   - Click "Book Slot" button
   - Confirm booking details
   - Optional: Select time duration for dynamic pricing calculation
4. **Receive Confirmation**: System confirms booking and provides instructions
5. **Arrival & Entry**:
   - Navigate to the booked slot using provided guidance
   - System detects vehicle and opens gate via servo motor
   - Park vehicle in designated slot
6. **Exit**: System detects departure and updates slot status to free

### For Administrators/Parking Operators
1. **Access Admin Panel**: Login to administrative interface
2. **Monitor Real-time Status**: View live occupancy of all slots
3. **View Analytics**: See booking history, revenue data, and utilization metrics
4. **Manage Pricing**: Adjust dynamic pricing parameters if needed
5. **Configure Special Slots**: Set up EV charging and handicapped designations
6. **Export Data**: Download logs for reporting and analysis

## Sample API Endpoints (if implemented with Flask)
```
GET  /api/slots          → Returns current status of all slots
POST /api/book           → Books a slot (requires slot_id, user_info, duration)
POST /api/cancel         → Cancels a booking
GET  /api/pricing        → Returns current pricing rates
GET  /api/admin/stats    → Returns administration statistics
```

## Future Enhancements

### Short-term Improvements
- [ ] **Mobile Application**: Develop native Android/iOS apps for better user experience
- [ ] **Enhanced Sensors**: Implement ultrasonic or camera-based detection for improved accuracy
- [ ] **Solar Power Integration**: Use solar panels with battery backup for sustainable operation
- [ ] **Weatherproofing**: Encase hardware in weather-resistant enclosures for outdoor deployment
- [ ] **Improved Debouncing**: Enhance sensor reading stability to prevent false triggers

### Medium-term Enhancements
- [ ] **Computer Vision**: Integrate OpenCV for license plate recognition and vehicle classification
- [ ] **Machine Learning Predictions**: Use historical data to forecast peak hours and optimize pricing
- [ ] **Multi-level Support**: Extend system to handle multi-story parking facilities
- [ ] **Payment Gateway Integration**: Implement real payment processing (Stripe, PayPal, etc.)
- [ ] **Navigation Assistance**: Add turn-by-turn guidance to booked slots within facility

### Long-term Vision
- [ ] **City-wide Network**: Connect multiple parking lots for city-wide availability view
- [ ] **Smart City Integration**: Interface with traffic management systems for congestion reduction
- [ ] **Autonomous Vehicle Support**: Create interfaces for self-driving cars to find and book parking
- [ ] **Environmental Impact Tracking**: Measure and report CO2 savings and fuel reduction metrics
- [ ] **Accessibility Features**: Enhanced support for differently-abled users with voice guidance and specialized interfaces

## Contributing

We welcome contributions to improve I-PARK! Please follow these guidelines:

### How to Contribute
1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Your Changes**
4. **Commit Your Changes**: `git commit -m 'Add amazing feature'`
5. **Push to Branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Contribution Areas
- **Documentation**: Improve README, add tutorials, create video demonstrations
- **Code Quality**: Refactor Python/JavaScript, add unit tests, improve error handling
- **Features**: Implement new functionalities from the future enhancements list
- **Hardware**: Suggest better sensor combinations or PCB designs
- **Testing**: Create test scenarios, develop simulation environments
- **Deployment**: Develop Docker configurations, cloud deployment scripts

### Reporting Issues
Please use the GitHub Issues tab to report:
- Bugs or unexpected behavior
- Hardware compatibility problems
- Software installation difficulties
- Feature requests or enhancements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025-2026 Nithya Shree P, Aishwarya Bhat, Meda Venkata Pranay Guptha, Prerana Srinath

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Acknowledgments

We express our sincere gratitude to:

- **Dr. Sanjay H. A**, Principal, BMS Institute of Technology & Management - For providing facilities and encouragement
- **Dr. A. Shobha Rani**, HOD, Department of ECE - For inspiration, guidance, and valuable suggestions
- **Dr. Sabina Rahaman & Dr. Thejaswini Ramesh**, Mini Project Coordinators - For technical support and guidance
- **Dr. Soumya Vastrad**, Project Guide - For valuable time, patience, suggestions, and periodic evaluation
- **Teaching & Non-teaching Staff**, Department of ECE - For cooperation and motivation
- **Our Parents & Friends** - For unwavering support and guidance throughout the project

## References

[1]. Dinesh Sahu, Priyanshu Sinha, Shiv Prakash, Tiansheng Yang, Rajkumar Singh Rathore, Lu Wang — "A Multi-Objective Optimization Framework for Smart Parking Using Digital Twin, Pareto Front, MDP, and PSO for Smart Cities", Scientific Reports, Nature Publishing Group, 2025.

[2]. Ahmed Tamim Zabir Prince, Dipta Paul, Abdullah Al Noman Shompod, Md. Sabbir Hosen, Ibrahim Ibne Moksud, Mahabub Alam Khan, Zahid Hasan Khoka, S M Aliuzzaman, Imran Miah, Riad Mollik Babu — "Design And Implementation of a Smart Wireless Parking System", Journal of Computer Science and Technology Studies (JCSTS), Vol. 7, No. 1, pp. 113–121, 2025.

[3]. Ibrahim Mutambik — "Sustainable IoT-Enabled Parking Management: A Multiagent Simulation Framework for Smart Urban Mobility", Sustainability, MDPI, 2025.

[4]. Bindu Madhavi Tummala, Mandarapu Deepak Prem Kumar, Shaik Nagurbasha — "Real-Time Parking Slot Detection and Enhanced Security System for Public Parking using IoT", 2025 International Conference on Inventive Computation Technologies (ICICT).

[5]. Rishab Agarwal, Rajat Gupta, Narender Narwal — "Smart Parking Exploration System in Real-Time Environment Through IoT", Arya College of Engineering/AIET (Academic Paper), 2025.

[6]. Gulmini Pradhan, Manas Ranjan Prusty, Vipul Singh Negi, Suchismita Chinara — "Advanced IoT-Integrated Parking Systems with Automated License Plate Recognition and Payment Management", Scientific Reports, Nature Portfolio, 2025.

[7]. Ahad, A., Khan, Z. R., & Ahmad, S. A. — “Intelligent Parking System”, World Journal of Engineering and Technology, 2016.

[8]. Shah, A., Satpute, A., Shinde, M., et al. — “Literature Review on Parking System”, 2021.

[9]. Al-Kharusi, H. & Al-Bahadly, I. — “Intelligent Parking Management System Based on Image Processing”, World Journal of Engineering and Technology, 2014.

[10]. Fahim, A., et al. — “Smart parking systems: comprehensive review based on technological approach, sensors utilized, networking technologies, user interface…”, 2021.

[11]. Elfaki, A. O., et al. — “A Smart Real-Time Parking Control and Monitoring System”, 2023.

[12]. Mahmud, S. A. — “A Survey of Intelligent Car Parking System”, 2013.

---

**Project Repository**: https://github.com/yourusername/i-park-smart-parking-system  
**Demo Video**: [Add link to demonstration video]  
**Project Documentation**: Full report available in `documents/final_report_(1).docx`

*Developed as a Bachelor of Engineering project in Electronics and Communication Engineering at BMS Institute of Technology & Management, affiliated with Visvesvaraya Technological University, Belagavi.*

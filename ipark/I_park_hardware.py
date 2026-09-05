from gpiozero import DigitalInputDevice, AngularServo
from time import sleep

# =============================
# TICKET DATABASE
# =============================
database = {
    "IPARK-111111": {"slot": 1, "status": "on time"},
    "IPARK-222222": {"slot": 2, "status": "out of time"},
    "IPARK-333333": {"slot": 3, "status": "on time"},
    "IPARK-444444": {"slot": 1, "status": "out of time"},
    "IPARK-555555": {"slot": 2, "status": "on time"}
}

print("Ticket database loaded.")
print(database)

# =============================
# IR SENSOR SETUP
# =============================
ir1 = DigitalInputDevice(17)  # Slot 1 sensor
ir2 = DigitalInputDevice(27)  # Slot 2 sensor
ir3 = DigitalInputDevice(22)  # Slot 3 sensor

slot_to_sensor = {
    1: ir1,
    2: ir2,
    3: ir3
}

# =============================
# SERVO SETUP
# =============================
servo = AngularServo(
    18,
    min_angle=0,
    max_angle=180,
    min_pulse_width=0.0005,
    max_pulse_width=0.0024,
    frame_width=0.02
)

def move_servo_gate():
    print("Opening gate (servo to 90°)...")
    servo.angle = 90
    sleep(5)
    print("Closing gate (servo back to 0°)...")
    servo.angle = 0
    sleep(1)

# =============================
# MAIN LOOP
# =============================
try:
    while True:  # Continuous program loop
        ticket = input("\nPlease enter your ticket number: ").strip()

        if ticket not in database:
            print("Invalid Ticket Number! Please check again.")
            continue

        ticket_info = database[ticket]
        slot = ticket_info["slot"]
        status = ticket_info["status"]

        print(f"\nTicket Found: {ticket}")
        print(f"Assigned Slot: {slot}")

        # Slot type information
        if slot == 3:
            print("Slot Type: EV Charging Slot")
        else:
            print("Slot Type: Normal Slot (No EV Charging)")

        print(f"Status: {status}")

        if status == "out of time":
            print("You have arrived at the wrong time, please come back at the correct time of your slot booked.")
            continue

        print("\nYou are on time! Checking your slot status...\n")

        sensor = slot_to_sensor[slot]

        # =============================
        # SLOT MONITORING
        # =============================
        while True:
            sensor_state = sensor.value  # 0 = occupied, 1 = free

            if sensor_state == 0:
                print(f"Slot {slot} is occupied, please wait...")

                # =============================
                # REDIRECTION FOR NORMAL SLOTS
                # =============================
                if slot in [1, 2]:  # Only normal slots
                    other_slot = 2 if slot == 1 else 1
                    other_sensor = slot_to_sensor[other_slot]

                    if other_sensor.value == 1:  # Other slot is free
                        print(f"Slot {other_slot} is currently free.")
                        choice = input(f"Would you like to switch to slot {other_slot}? (yes/no): ").strip().lower()

                        if choice == "yes":
                            print(f"Redirecting you to slot {other_slot}...")
                            slot = other_slot
                            sensor = other_sensor
                            continue  # Restart checking for new slot
                        else:
                            print("Okay, waiting for your original slot to get free.")

            else:
                print(f"Slot {slot} is ready, you can park your vehicle now.")
                move_servo_gate()
                break

            sleep(1)

except KeyboardInterrupt:
    print("\nProgram stopped by user.")
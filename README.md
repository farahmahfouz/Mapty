# Mapty Documentation

## Overview
The Workout Tracker is a JavaScript-based application that allows users to track their workout progress. It provides functionalities such as adding new exercises, logging workouts, and viewing previous records.

## Features
- Add new workouts with exercise details
- Log workout sessions with date and time
- View and edit workout history
- Delete unnecessary logs

## Technologies Used
- JavaScript (ES6+)
- HTML
- CSS
- Local Storage (for data persistence)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/farahmahfouz/Mapty.git
   ```
2. Navigate to the project folder:
   ```sh
   cd mapty
   ```
3. Open `index.html` in a web browser.

## Usage
### Adding a New Workout
1. Enter the exercise name, duration, and calories burned.
2. Click the "Add Workout" button.
3. The workout will be saved and displayed in the list.

### Viewing Workout History
- The logged workouts will be displayed in the history section.
- Each entry will show the date, time, and details of the workout.

### Editing a Workout
1. Click the "Edit" button next to a workout entry.
2. Modify the details as needed.
3. Click "Save" to update the record.

### Deleting a Workout
- Click the "Delete" button next to a workout entry to remove it permanently.

## Code Structure
### `app.js`
Handles all the logic, including:
- Capturing user input
- Saving data to local storage
- Retrieving and displaying saved workouts

### `index.html`
Defines the structure of the app, including input fields, buttons, and display sections.

### `style.css`
Contains styling rules to enhance the user interface.

## Data Storage
Workout data is stored in the browser's local storage using JSON format. Example:
```json
{
  "workouts": [
    {
      "id": 1,
      "exercise": "Running",
      "duration": 30,
      "calories": 300,
      "date": "2024-02-21"
    }
  ]
}
```

## Future Improvements
- Add user authentication for personalized workout logs.
- Integrate a database for better data management.
- Implement graphical workout progress visualization.

## Contact
For any questions or contributions, please reach out to `farahmahfouz11@gmail.com`.


function updateExercises() {
    var muscleGroup = document.getElementById("muscle").value;
    var exerciseSelect = document.getElementById("exercise");

    var exercises = {
        "Back": ["Lat Pulldown (Normal Grip)", "Lat Pulldown (Wide Grip)", "Row (sitting/machine)", "Row (standing)"],
        "Biceps": ["Barbell Curl", "Hammer Curl", "Preacher Curl", "Cable Curl", "Dumbbell Curl"],
        "Calves": ["Standing Calf Raise", "Seated Calf Raise", "Calf Raise Single-Leg"],
        "Chest": ["Bench Press", "Chest Fly", "Dumbbell Press", "Incline Bench Press", "Incline Dumbbell Press", "Dips", "Push-ups"],
        "Core": ["Sit-up", "Plank", "Side-Plank", "Russian Twist", "Mountain Climbers", "Cable Ab Pulldown", "Ab Crunch Machine", "Rotary Torso Machine"],
        "Forearms": ["Wrist Curl", "Reverse Wrist Curl", "Hammer Curl", "Dead Hang", "Barbell Hold"],
        "Glutes": ["Squats", "Glute Bridge", "Hip Thrust", "Deadlift", "Bulgarian Split Squat", "Lunges", "Leg Press"],
        "Hamstrings": ["Romanian Deadlift", "Curl Machine (Sitting)", "Curl Machine (Laying)", "Good Mornings", "Nordic Hamstring Curl", "Squats", "Leg Press"],
        "Hip": ["Hip Thrust", "Glute Bridge", "Hip Abduction Machine", "Hip Adduction Machine", "Side Leg Raises", "Single-Leg Hip Raise", "Standing Hip Flexor"],
        "Quads": ["Squats", "Leg Press", "Front Squat", "Bulgarian Split Squat", "Lunges", "Leg Extension Machine", "Hack Squat", "Plyometric Jump Squats", "Box Jumps", "Goblet Squat", "Pistol Squat"],
        "Shoulders": ["Overhead Press (Barbell)", "Overhead Press (Dumbbell)", "Overhead Press (Machine)", "Lateral Raise", "Front Raise", "Rear Delt Fly (Dumbbell)", "Rear Delt Fly (Machine)", "Shoulder Shrugs"],
        "Traps": ["Shrugs", "Farmer's Walk", "Deadlift", "Reverse Fly"],
        "Triceps": ["Dips", "Tricep Pushdowns (Cable)", "Overhead Tricep Extension (Dumbbell)", "Overhead Tricep Extension (Cable)", "Skull Crushers (Barbell)", "Skull Crushers (Dumbbell)", "Close-Grip Bench Press", "Kickbacks (Cable)", "One-Arm Tricep Pushdown"]
    };

    // Clear current options
    exerciseSelect.innerHTML = "";

    // Add default option
    var defaultOption = document.createElement("option");
    defaultOption.value = "Other";
    defaultOption.text = "Other";
    exerciseSelect.appendChild(defaultOption);

    // Populate new options based on selected muscle group
    if (exercises[muscleGroup]) {
        exercises[muscleGroup].forEach(function(exercise) {
            var option = document.createElement("option");
            option.value = exercise.toLowerCase().replace(/\s+/g, '-');
            option.text = exercise;
            exerciseSelect.appendChild(option);
        });
    }
}

document.getElementById('exerciseForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const muscle = document.getElementById('muscle').value;
    const exercise = document.getElementById('exercise').value;
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const weight = document.getElementById('weight').value;
    const date = document.getElementById('date').value;

    // Basic validation
    if (!muscle || !exercise || !sets || !reps || !weight || !date) {
        alert('Please fill in all fields.');
        return;
    }

    const newExerciseData = {
        muscle: muscle,
        exercise: exercise,
        sets: sets,
        reps: reps,
        weight: weight
    };

    let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    let existingExercise = exercises.find(e => e.date === date);

    if (existingExercise) {
        // Append new exercise data to the existing entry
        existingExercise.details.push(newExerciseData);
    } else {
        // Create a new entry
        exercises.push({
            date: date,
            details: [newExerciseData]
        });
    }

    localStorage.setItem('exercises', JSON.stringify(exercises));

    // Provide feedback to the user
    alert('Exercise added successfully!');

    // Optionally, clear the form
    document.getElementById('exerciseForm').reset();

    // Refresh the logContainer
    const logContainer = document.getElementById('logContainer');
    logContainer.innerHTML = '';

    // Sort exercises by date in descending order
    exercises.sort((a, b) => new Date(b.date) - new Date(a.date));

    exercises.forEach(exerciseEntry => {
        const newButton = document.createElement('button');
        newButton.textContent = exerciseEntry.date;
        newButton.classList.add('exercise-log-button');

        newButton.addEventListener('click', function(event) {
            const rect = newButton.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const buttonWidth = newButton.offsetWidth;
            const deleteThreshold = 50; // Adjust as needed

            if (x > buttonWidth - deleteThreshold) {
                // Right side clicked - confirm deletion
                const confirmDelete = confirm("Are you sure you want to delete this exercise?");
                if (confirmDelete) {
                    // Delete the button
                    newButton.remove();
                    // Remove exercise from localStorage
                    exercises = exercises.filter(e => e.date !== exerciseEntry.date);
                    localStorage.setItem('exercises', JSON.stringify(exercises));
                }
            } else {
                // Left side clicked - show details
                const details = exerciseEntry.details.map(detail => `${detail.exercise} for ${detail.sets} sets and ${detail.reps} reps at ${detail.weight} lbs`).join('\n');
                alert(details);
            }
        });

        logContainer.appendChild(newButton);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const logContainer = document.getElementById('logContainer');
    let exercises = JSON.parse(localStorage.getItem('exercises')) || [];

    // Sort exercises by date in descending order
    exercises.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create and append buttons for each exercise
    exercises.forEach(exerciseEntry => {
        const newButton = document.createElement('button');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');

        newButton.textContent = exerciseEntry.date;
        newButton.classList.add('exercise-log-button');
        div1.classList.add('div1');
        div2.classList.add('div2');

        newButton.appendChild(div1);
        newButton.appendChild(div2);

        newButton.addEventListener('click', function(event) {
            const rect = newButton.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const buttonWidth = newButton.offsetWidth;
            const deleteThreshold = buttonWidth * 0.2; // Adjust as needed

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
            } 
            else {
                const closePopupBtn = document.getElementById('closePopupBtn');
                const popup = document.getElementById('popup');
                const exerContent = document.getElementById('exerContent');

                details = exerciseEntry.details.map(detail => {
                    const exerciseDiv = document.createElement('div');
                    exerciseDiv.classList.add('exercise-entry');

                    const exerciseText = document.createElement('p');
                    exerciseDiv.classList.add('p-entry');
                    exerciseText.textContent = `${detail.exercise} for ${detail.sets} sets and ${detail.reps} reps at ${detail.weight} lbs`;

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'X';
                    deleteButton.classList.add('delete-btn');

                    deleteButton.addEventListener('click', () => {
                        exerciseDiv.remove();
                        exerciseEntry.details = exerciseEntry.details.filter(d => d !== detail);
                        localStorage.setItem('exercises', JSON.stringify(exercises));

                    });

                    exerciseDiv.appendChild(exerciseText);
                    exerciseDiv.appendChild(deleteButton);

                    return exerciseDiv;
                });

                exerContent.innerHTML = ''; // Clear previous content
                details.forEach(detail => exerContent.appendChild(detail));

                newButton.addEventListener('click', function() {
                    popup.style.display = 'flex';
                });

                closePopupBtn.addEventListener('click', function() {
                    popup.style.display = 'none';
                });

                window.addEventListener('click', function(event) {
                    if (event.target === popup) {
                        popup.style.display = 'none';
                    }
                });
            }
        });

        logContainer.appendChild(newButton);
    });
});
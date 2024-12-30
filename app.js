import { samplePrograms } from './samplePrograms.js';

class WorkoutApp {
    constructor() {
        this.storage = {

            getCurrentWorkout: () => {
                const data = localStorage.getItem('currentWorkout');
                return data ? JSON.parse(data) : null;
            },

            setCurrentWorkout: (workout) => {
                // Initialize with first workout and empty set data
                const formattedWorkout = {
                    ...workout,
                    currentWorkoutIndex: 0,
                    currentPeriod: 1,
                    exercises: workout.workouts[0].exercises.map(exercise => ({
                        ...exercise,
                        sets: Array(exercise.sets).fill().map(() => ({
                            weight: 0,
                            reps: 0,
                            completed: false
                        }))
                    }))
                };
                localStorage.setItem('currentWorkout', JSON.stringify(formattedWorkout));
            },

            getWorkoutHistory: () => {
                const history = localStorage.getItem('workoutHistory');
                return history ? JSON.parse(history) : [];
            },

            saveWorkoutHistory: (workout) => {
                const history = this.storage.getWorkoutHistory();
                history.push({
                    date: new Date().toISOString(),
                    programId: workout.id,
                    workout: workout.workouts[workout.currentWorkoutIndex].name,
                    exercises: workout.exercises
                });
                localStorage.setItem('workoutHistory', JSON.stringify(history));
            }
        }

        // Initialize sample programs in localStorage if not present
        if (!localStorage.getItem('workout_programs')) {
            localStorage.setItem('workout_programs', JSON.stringify(samplePrograms));
        }

        // Add event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('current-workout')
            .addEventListener('click', () => this.showCurrentWorkout());

        document.getElementById('new-workout')
            .addEventListener('click', () => this.startNewWorkout());
    }

    showCurrentWorkout() {
        const current = this.storage.getCurrentWorkout();
        const content = document.querySelector('ion-content');

        if (!current) {
            content.innerHTML = `
                <ion-grid class="ion-padding">
                    <ion-text color="medium">
                        <h2>No workout selected</h2>
                        <p>Click "New Workout" to choose a workout</p>
                    </ion-text>
                </ion-grid>
            `;
            return; 
        }

        // Get the current workout using the index
        const currentWorkout = current.workouts[current.currentWorkoutIndex];

        // Calculate progress values (fixing the lag)
        const workoutProgress = (current.currentWorkoutIndex) / (current.workouts.length - 1);
        const periodProgress = (current.currentPeriod - 1) / current.totalPeriods;

        content.innerHTML = `
        <ion-grid class="ion-padding">
            
            <div style="margin-bottom: 20px;">
                <h2>${current.name}</h2>
                <h3>${currentWorkout.name}</h3>
            </div>

            <!-- Period Progress -->
            <div style="margin-bottom: 20px;">
                <p>Period ${current.currentPeriod} of ${current.totalPeriods}</p>
                <ion-progress-bar value="${(current.currentPeriod) / current.totalPeriods}">
                </ion-progress-bar>
            </div>

            <!-- Workout Progress in Current Period -->
            <div style="margin-bottom: 20px;">
                
                <p>Workout ${current.currentWorkoutIndex + 1} of ${current.workouts.length}</p>
                <ion-progress-bar value="${(current.currentWorkoutIndex + 1) / current.workouts.length}">
                </ion-progress-bar>
            </div>

            <!-- Exercises with set tracking -->
            ${current.exercises.map((exercise, exerciseIndex) => `
                <div class="exercise-card" style="margin-bottom: 20px; padding: 10px;">
                    <h4>${exercise.name}</h4>
                    
                    <div class="sets-container">
                        ${exercise.sets.map((set, setIndex) => `
                            <div class="set-inputs" style="margin-bottom: 10px;">
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <span style="${set.completed ? 'color: var(--ion-color-medium);' : ''}">Set ${setIndex + 1}:</span>
                                    <input type="number" 
                                        id="weight-${exerciseIndex}-${setIndex}"
                                        placeholder="Weight"
                                        style="width: 80px; ${set.completed ? 'color: var(--ion-color-medium);' : ''}"
                                        value="${set.weight || ''}"
                                        ${set.completed ? 'disabled' : ''}
                                    >
                                    <input type="number"
                                        id="reps-${exerciseIndex}-${setIndex}"
                                        placeholder="Reps"
                                        style="width: 60px; ${set.completed ? 'color: var(--ion-color-medium);' : ''}"
                                        value="${set.reps || ''}"
                                        ${set.completed ? 'disabled' : ''}
                                    >
                                    <ion-button 
                                        ${set.completed ? 'fill="solid"' : 'fill="clear"'} 
                                        size="small" 
                                        id="${set.completed ? 'uncomplete' : 'complete'}-set-${exerciseIndex}-${setIndex}"
                                    >
                                        <ion-icon name="checkmark-circle${set.completed ? '' : '-outline'}" style="font-size: 24px;"></ion-icon>
                                    </ion-button>
                                    <ion-button 
                                        fill="clear"
                                        size="small"
                                        color="danger"
                                        id="delete-set-${exerciseIndex}-${setIndex}"
                                        ${set.completed ? 'disabled' : ''}
                                    >
                                        <ion-icon name="trash-outline" style="font-size: 20px;"></ion-icon>
                                    </ion-button>
                                </div>
                            </div>
                        `).join('')}
                        
                        <!-- Add set button aligned with "Set" text -->
                        <div class="set-inputs" style="margin-bottom: 10px;">
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <ion-button fill="clear" size="small" id="add-set-${exerciseIndex}">
                                    <ion-icon name="add-circle-outline" style="font-size: 24px;"></ion-icon>
                                    <span style="margin-left: 5px;">Add Set</span>
                                </ion-button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}

            <ion-button expand="block" id="complete-workout">
                Complete Workout
            </ion-button>
            <ion-button expand="block" fill="outline" id="back-home">
                Back to Home
            </ion-button>
        </ion-grid>
    `;

        // Add event listeners
        current.exercises.forEach((exercise, exerciseIndex) => {
        
            // Add set button
            document.getElementById(`add-set-${exerciseIndex}`).addEventListener('click', () => this.addSet(exerciseIndex));

            // Complete and delete set buttons
            exercise.sets.forEach((set, setIndex) => {
                const buttonId = set.completed ? 'uncomplete' : 'complete';
                document.getElementById(`${buttonId}-set-${exerciseIndex}-${setIndex}`).addEventListener('click', () => this.toggleSet(exerciseIndex, setIndex));
                
                if (!set.completed) {
                    document.getElementById(`delete-set-${exerciseIndex}-${setIndex}`).addEventListener('click', () => this.deleteSet(exerciseIndex, setIndex));
            }
        });
    });

        // Add event listeners for "Complete Workout" and "Back Home" buttons
        document.getElementById('complete-workout').addEventListener('click', () => this.completeWorkout());
        document.getElementById('back-home').addEventListener('click', () => this.returnToHome());
    }

    addSet(exerciseIndex) {
        const current = this.storage.getCurrentWorkout();
        if (!current) return;

        // Add new set to the exercise
        current.exercises[exerciseIndex].sets.push({
            weight: 0,
            reps: 0,
            completed: false
        });

        // Save and refresh
        localStorage.setItem('currentWorkout', JSON.stringify(current));
        this.showCurrentWorkout();
    }

    deleteSet(exerciseIndex, setIndex) {
        const current = this.storage.getCurrentWorkout();
        if (!current) return;

        // Remove the set
        current.exercises[exerciseIndex].sets.splice(setIndex, 1);

        // Save and refresh
        localStorage.setItem('currentWorkout', JSON.stringify(current));
        this.showCurrentWorkout();
    }

    toggleSet(exerciseIndex, setIndex) {
        const current = this.storage.getCurrentWorkout();
        if (!current) return;
    
        const set = current.exercises[exerciseIndex].sets[setIndex];
        
        if (!set.completed) {
            // Completing the set
            const weightInput = document.getElementById(`weight-${exerciseIndex}-${setIndex}`);
            const repsInput = document.getElementById(`reps-${exerciseIndex}-${setIndex}`);
            
            const weight = parseFloat(weightInput.value);
            const reps = parseInt(repsInput.value);
    
            if (!weight || !reps) {
                alert('Please enter both weight and reps');
                return;
            }
    
            set.weight = weight;
            set.reps = reps;
        }
        
        // Toggle completion status
        set.completed = !set.completed;
    
        // Update storage and refresh UI
        localStorage.setItem('currentWorkout', JSON.stringify(current));
        this.showCurrentWorkout();
    }

    startNewWorkout() {
        const programs = JSON.parse(localStorage.getItem('workout_programs'));
        const content = document.querySelector('ion-content');

        content.innerHTML = `
            <ion-grid class="ion-padding">
                <ion-list>
                    ${programs.map(program => `
                        <ion-item button onclick="app.selectWorkout('${program.id}')">
                            <ion-label>
                                <h2>${program.name}</h2>
                                <p>${program.workouts.length} workouts per period</p>
                            </ion-label>
                            <ion-icon name="chevron-forward" slot="end"></ion-icon>
                        </ion-item>
                    `).join('')}
                </ion-list>

                <ion-button expand="block" id="back-home">
                    Back to Home
                </ion-button>
            </ion-grid>
        `;

        document.getElementById('back-home').addEventListener('click', () => this.returnToHome());
    }

    selectWorkout(programId) {
        const programs = JSON.parse(localStorage.getItem('workout_programs'));
        const selected = programs.find(p => p.id === programId);

        if (selected) {
            this.storage.setCurrentWorkout(selected);
            this.showCurrentWorkout();
        }
    }

    completeWorkout() {
        const current = this.storage.getCurrentWorkout();
        if (!current) return;

        // Save workout history
        this.storage.saveWorkoutHistory(current);

        // Update to next workout
        const nextIndex = (current.currentWorkoutIndex + 1) % current.workouts.length;
        const nextPeriod = nextIndex === 0 ? current.currentPeriod + 1 : current.currentPeriod;

        if (nextPeriod > current.totalPeriods) {
            this.completeProgram(current);
            return;
        }

        // Reset exercise data for next workout
        const nextWorkout = current.workouts[nextIndex];
        current.exercises = nextWorkout.exercises.map(exercise => ({
            ...exercise,
            sets: Array(exercise.sets).fill().map(() => ({
                weight: 0,
                reps: 0,
                completed: false
            }))
        }));

        // Update storage
        localStorage.setItem('currentWorkout', JSON.stringify({
            ...current,
            currentWorkoutIndex: nextIndex,
            currentPeriod: nextPeriod,
            exercises: current.exercises
        }));

        this.showCurrentWorkout();
    }

    completeProgram() {
        const content = document.querySelector('ion-content');
        const current = this.storage.getCurrentWorkout();
        if (!current) return;

        content.innerHTML = `
            <ion-grid class="ion-padding">
                <h2>Congratulations!</h2>
                <p>You've completed all ${current.totalPeriods} periods of ${current.name}!</p>
                <ion-button expand="block" id="back-home">
                    Back to Home
                </ion-button>
            </ion-grid>
        `;

        document.getElementById('back-home').addEventListener('click', () => {
            localStorage.removeItem('currentWorkout');  // Clear current workout
            this.returnToHome();
        });
    }

    returnToHome() {
        const content = document.querySelector('ion-content');
        content.innerHTML = `
            <ion-grid class="ion-padding">
                <ion-row>
                    <ion-col>
                        <ion-button expand="block" size="large" id="current-workout">
                            Current Workout
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-button expand="block" size="large" id="new-workout">
                            New Workout
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        `;
        this.initializeEventListeners();
    }
}

// Initialize app
window.app = new WorkoutApp();
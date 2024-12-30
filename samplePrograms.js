export const samplePrograms = [
    {
        id: 'beginner-full-body',
        name: 'Beginner Full Body',
        totalPeriods: 4,
        workouts: [
            {
                name: 'Full Body A',
                exercises: [
                    { name: 'Squats', sets: 2, reps: 8 }, // TODO: add weight
                    { name: 'Push-Ups', sets: 2, reps: 10 },
                    { name: 'Dumbbell Rows', sets: 2, reps: 10 },
                    { name: 'Shoulder Press', sets: 2, reps: 8 }
                ]
            },
            {
                name: 'Full Body B',
                exercises: [
                    { name: 'Deadlifts', sets: 2, reps: 8 },
                    { name: 'Bench Press', sets: 2, reps: 8 },
                    { name: 'Lat Pulldowns', sets: 2, reps: 10 },
                    { name: 'Lunges', sets: 2, reps: 10 }
                ]
            },
            {
                name: 'Full Body C',
                exercises: [
                    { name: 'Romanian Deadlifts', sets: 2, reps: 8 },
                    { name: 'Incline Push-Ups', sets: 2, reps: 10 },
                    { name: 'Cable Rows', sets: 2, reps: 10 },
                    { name: 'Planks', sets: 2, reps: 30 }
                ]
            }
        ]
    },
    {
        id: 'upper-lower',
        name: 'Upper/Lower Split',
        totalPeriods: 4,
        workouts: [
            {
                name: 'Upper Body',
                exercises: [
                    { name: 'Bench Press', sets: 2, reps: 8 },
                    { name: 'Barbell Rows', sets: 2, reps: 8 },
                    { name: 'Shoulder Press', sets: 2, reps: 10 },
                    { name: 'Pull-Ups', sets: 2, reps: 8 }
                ]
            },
            {
                name: 'Lower Body',
                exercises: [
                    { name: 'Squats', sets: 2, reps: 8 },
                    { name: 'Romanian Deadlifts', sets: 2, reps: 10 },
                    { name: 'Leg Press', sets: 2, reps: 12 },
                    { name: 'Calf Raises', sets: 2, reps: 15 }
                ]
            }
        ]
    },
    {
        id: 'ppl',
        name: 'Push/Pull/Legs',
        totalPeriods: 4,
        workouts: [
            {
                name: 'Push',
                exercises: [
                    { name: 'Bench Press', sets: 2, reps: 8 },
                    { name: 'Shoulder Press', sets: 2, reps: 10 },
                    { name: 'Tricep Extensions', sets: 2, reps: 12 }
                ]
            },
            {
                name: 'Pull',
                exercises: [
                    { name: 'Barbell Rows', sets: 4, reps: 8 },
                    { name: 'Pull-Ups', sets: 2, reps: 8 },
                    { name: 'Bicep Curls', sets: 2, reps: 12 }
                ]
            },
            {
                name: 'Legs',
                exercises: [
                    { name: 'Squats', sets: 2, reps: 8 },
                    { name: 'Romanian Deadlifts', sets: 2, reps: 10 },
                    { name: 'Leg Press', sets: 2, reps: 12 }
                ]
            }
        ]
    }
];
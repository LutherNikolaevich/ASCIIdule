// Theme management
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme
document.documentElement.setAttribute('data-theme', prefersDarkScheme.matches ? 'dark' : 'light');
themeToggle.textContent = prefersDarkScheme.matches ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Schedule management
class Schedule {
    constructor() {
        this.classes = [];
        this.display = document.getElementById('schedule-display');
        this.render(); // Initial render
    }

    addClass(subject, day, startTime, endTime, room) {
        this.classes.push({ subject, day, startTime, endTime, room });
        this.classes.sort((a, b) => {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const dayCompare = days.indexOf(a.day) - days.indexOf(b.day);
            return dayCompare !== 0 ? dayCompare : a.startTime.localeCompare(b.startTime);
        });
        this.render();
    }

    formatTime(time) {
        return time.replace(/^0/, '');
    }

    generateASCII() {
        if (this.classes.length === 0) {
            return 'No classes added yet.';
        }

        // Group classes by day
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const groupedClasses = {};
        days.forEach(day => {
            groupedClasses[day] = this.classes.filter(c => c.day === day);
        });

        let ascii = '';
        
        // Generate table for each day that has classes
        days.forEach(day => {
            const dayClasses = groupedClasses[day];
            if (dayClasses.length > 0) {
                // Calculate column widths for this day's classes
                const maxSubjectLength = Math.max(7, ...dayClasses.map(c => c.subject.length));
                const maxRoomLength = Math.max(4, ...dayClasses.map(c => c.room.length));
                
                // Day header
                ascii += `\n${day}\n`;
                ascii += '─'.repeat(maxSubjectLength + maxRoomLength + 25) + '\n';
                
                // Column headers
                ascii += 'Subject'.padEnd(maxSubjectLength) + ' │ ' +
                        'Start'.padEnd(5) + ' │ ' +
                        'End'.padEnd(5) + ' │ ' +
                        'Room'.padEnd(maxRoomLength) + '\n';
                ascii += '─'.repeat(maxSubjectLength) + '─┼─' +
                        '─'.repeat(5) + '─┼─' +
                        '─'.repeat(5) + '─┼─' +
                        '─'.repeat(maxRoomLength) + '\n';

                // Class rows
                dayClasses.forEach(c => {
                    const subject = c.subject.padEnd(maxSubjectLength);
                    const start = this.formatTime(c.startTime).padEnd(5);
                    const end = this.formatTime(c.endTime).padEnd(5);
                    const room = c.room.padEnd(maxRoomLength);
                    
                    ascii += `${subject} │ ${start} │ ${end} │ ${room}\n`;
                });
                
                ascii += '─'.repeat(maxSubjectLength + maxRoomLength + 25) + '\n';
            }
        });

        return ascii;
    }

    render() {
        if (this.display) {
            this.display.textContent = this.generateASCII();
        }
    }
}

// Initialize schedule
const schedule = new Schedule();

// Form handling
const addClassButton = document.getElementById('add-class');
const subjectInput = document.getElementById('subject');
const dayInput = document.getElementById('day');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const roomInput = document.getElementById('room');

addClassButton.addEventListener('click', () => {
    const subject = subjectInput.value.trim();
    const day = dayInput.value;
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const room = roomInput.value.trim();

    if (!subject || !startTime || !endTime || !room) {
        alert('Please fill in all fields');
        return;
    }

    if (startTime >= endTime) {
        alert('End time must be after start time');
        return;
    }

    schedule.addClass(subject, day, startTime, endTime, room);
    
    // Clear inputs
    subjectInput.value = '';
    startTimeInput.value = '';
    endTimeInput.value = '';
    roomInput.value = '';
}); 
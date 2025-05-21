const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

document.documentElement.setAttribute('data-theme', prefersDarkScheme.matches ? 'dark' : 'light');
themeToggle.textContent = prefersDarkScheme.matches ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// 🦄 Psst! Schedules are cooler in ASCII.
class Schedule {
    constructor() {
        this.classes = [];
        this.display = document.getElementById('schedule-display');
        this.render();
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
            // 👀 Nothing to see here... yet!
            return 'No classes added yet.';
        }

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const groupedClasses = {};
        days.forEach(day => {
            groupedClasses[day] = this.classes.filter(c => c.day === day);
        });

        let ascii = '';
        
        days.forEach(day => {
            const dayClasses = groupedClasses[day];
            if (dayClasses.length > 0) {
                const maxSubjectLength = Math.max(7, ...dayClasses.map(c => c.subject.length));
                const maxRoomLength = Math.max(4, ...dayClasses.map(c => c.room.length));
                
                ascii += `\n${day}\n`;
                ascii += '─'.repeat(maxSubjectLength + maxRoomLength + 25) + '\n';
                
                ascii += 'Subject'.padEnd(maxSubjectLength) + ' │ ' +
                        'Start'.padEnd(5) + ' │ ' +
                        'End'.padEnd(5) + ' │ ' +
                        'Room'.padEnd(maxRoomLength) + '\n';
                ascii += '─'.repeat(maxSubjectLength) + '─┼─' +
                        '─'.repeat(5) + '─┼─' +
                        '─'.repeat(5) + '─┼─' +
                        '─'.repeat(maxRoomLength) + '\n';

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

// 🧙‍♂️ Schedule wizardry starts here!
const schedule = new Schedule();

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
        alert('Please fill in all fields (unless you have a time machine).');
        return;
    }

    if (startTime >= endTime) {
        alert('End time must be after start time. Unless you\'re a time traveler.');
        return;
    }

    schedule.addClass(subject, day, startTime, endTime, room);
    
    // ✨ Inputs reset! Ready for more scheduling magic.
    subjectInput.value = '';
    startTimeInput.value = '';
    endTimeInput.value = '';
    roomInput.value = '';
});
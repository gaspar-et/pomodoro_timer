// DOM elements
const timerDisplay = document.getElementById("timer");
const cycleCountDisplay = document.getElementById("cycle-count");
const modeTitle = document.getElementById("mode-title");
const themeToggleBtn = document.getElementById("theme-toggle");
const comboCountDisplay = document.getElementById("combo-count");

// Timer values
let workDuration = 50*60;
let breakDuration = 10*60;
let longBreakDuration = 25*60;
let currentTime = workDuration;
let isRunning = false;
let isBreak = false;
let interval = null;
let pomodoroCount = 0;
let comboCount = 0;

// Display initial time
function updateDisplay() {
    const minutes = Math.floor(currentTime / 60).toString().padStart(2, "0");
    const seconds = (currentTime % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Start the timer
function startTimer() {
    if (isRunning) return;
    isRunning = true;
  
    // Update title based on session typemode
    modeTitle.textContent = isBreak
        ? pomodoroCount >= 4
            ? "LONG BREAK"
            : "BREAK TIME..."
        : "WORK TIME!"
  
    interval = setInterval(() => {
        if (currentTime > 0) {
            currentTime--;
            updateDisplay();
        } else {
            clearInterval(interval);
            isRunning = false;
  
            if (!isBreak) {
                // Work session ended
                pomodoroCount++;
                cycleCountDisplay.textContent = pomodoroCount;
                
                if (pomodoroCount >= 4) {
                    //Add combo count
                    comboCount++;
                    comboCountDisplay.textContent = comboCount;
                    
                    // Trigger long break
                    currentTime = longBreakDuration;
                    modeTitle.textContent = "LONG BREAK";
                } else {
                    // Regular short break
                    currentTime = breakDuration;
                    modeTitle.textContent = "BREAK TIME...";
                }
                
                isBreak = true;
            } else {
                // End of break (short or long)
                isBreak = false;
                currentTime = workDuration;
            
            
                // After long break, reset pomodoro counter
                if (pomodoroCount >= 4) {
                    pomodoroCount = 0;
                    cycleCountDisplay.textContent = pomodoroCount;
                }
  
            
                modeTitle.textContent = "WORK TIME!";
            }
            
            updateDisplay();
        }
    }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
  modeTitle.textContent = "TIMER PAUSED";
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  isBreak = false;
  currentTime = workDuration;
  pomodoroCount = 0;
  updateDisplay();
  cycleCountDisplay.textContent = pomodoroCount;
  modeTitle.textContent = "START WORK";
}

// Dark Mode Toggle
themeToggleBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");

  // Optional: Save preference
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }

  isBreak = false;
  currentTime = workDuration;
  updateDisplay();
  modeTitle.textContent = "START WORK";
  cycleCountDisplay.textContent = pomodoroCount;
  comboCountDisplay.textContent = comboCount;
});

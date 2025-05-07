// DOM elements
const timerDisplay = document.getElementById("timer");
const cycleCountDisplay = document.getElementById("cycle-count");
const modeTitle = document.getElementById("mode-title");
const themeToggleBtn = document.getElementById("theme-toggle");
const comboCountDisplay = document.getElementById("combo-count");
const timerEl = document.getElementById("timer");
const timerBox = document.getElementById("timer-box");
const progressBar = document.getElementById("progress-bar");

// DOM elements Settings
const settingsToggleBtn = document.getElementById("settings-toggle");
const settingsPanel = document.getElementById("settings-panel");
const settingsModal = document.getElementById("settings-modal");
const saveSettingsBtn = document.getElementById("save-settings");
const cancelSettingsBtn = document.getElementById("cancel-settings");

const workInput = document.getElementById("work-duration-input");
const breakInput = document.getElementById("break-duration-input");
const longBreakInput = document.getElementById("longbreak-duration-input");

const workEndSound = document.getElementById("work-end-sound");
const breakEndSound = document.getElementById("break-end-sound");
const workSoundSelect = document.getElementById("work-sound-select");
const breakSoundSelect = document.getElementById("break-sound-select");
const workVolumeSlider = document.getElementById("work-volume");
const breakVolumeSlider = document.getElementById("break-volume");
const autoStartBreakCheckbox = document.getElementById("auto-start-break");
const autoStartWorkCheckbox = document.getElementById("auto-start-work");

let autoStartBreak = false;
let autoStartWork = false;

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

    if (!isBreak) {
        const progress = 100 - (currentTime / workDuration) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.className = "h-full bg-green-500 transition-all duration-300 ease-in-out";
    } else {
        const progress = (currentTime / (pomodoroCount >= 4 ? longBreakDuration : breakDuration)) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.className = "h-full bg-blue-500 transition-all duration-300 ease-in-out";
    }
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
        if (!isBreak) {
            timerBox.classList.add("animate-pulse");
          } else {
            timerBox.classList.remove("animate-pulse");
          }
  
    interval = setInterval(() => {
        if (currentTime > 0) {
            currentTime--;
            updateDisplay();
        } else {
            clearInterval(interval);
            isRunning = false;
  
            if (!isBreak) {
                // Work session ended
                workEndSound.play();
                isBreak = true;
                pomodoroCount++;
                cycleCountDisplay.textContent = pomodoroCount;
                currentTime = pomodoroCount >= 4 ? longBreakDuration : breakDuration;
                modeTitle.textContent = pomodoroCount >= 4 ? "LONG BREAK" : "BREAK TIME...";
                updateDisplay();

                if (autoStartBreak) {
                  startTimer(); // auto-start break
                } else {
                  isRunning = false;
                }
            } else {
                // End of break (short or long)
                breakEndSound.play();
                isBreak = false;
            
                // After long break, reset pomodoro counter
                if (pomodoroCount >= 4) {
                    pomodoroCount = 0;
                    cycleCountDisplay.textContent = pomodoroCount;
                    comboCount++;
                    comboCountDisplay.textContent = comboCount;
                }
                currentTime = workDuration;
                modeTitle.textContent = "WORK TIME!";
                updateDisplay();
                
                if (autoStartWork) {
                  startTimer(); // auto-start work
                } else {
                  isRunning = false
                }
            }
        }
    }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
  modeTitle.textContent = "TIMER PAUSED";
  timerBox.classList.remove("animate-pulse");
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  isBreak = false;
  currentTime = workDuration;
  pomodoroCount = 0;
  comboCount = 0;

  updateDisplay();
  cycleCountDisplay.textContent = pomodoroCount;
  comboCountDisplay.textContent = comboCount;
  modeTitle.textContent = "START WORK";
  progressBar.style.width = `0%`;
  progressBar.className = "h-full bg-green-500 transition-all duration-300 ease-in-out";
  timerBox.classList.remove("animate-pulse");
}

//Change font Toggle
timerEl.addEventListener("click", () => {
    if (timerEl.classList.contains("font-raw")) {
      timerEl.classList.remove("font-raw");
      timerEl.classList.add("font-render");
    } else {
      timerEl.classList.remove("font-render");
      timerEl.classList.add("font-raw");
    }
});

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

// Settings Panel
settingsToggleBtn.addEventListener("click", () => {
  settingsPanel.classList.remove("pointer-events-none", "hidden");
  setTimeout(() => {
    settingsModal.classList.remove("scale-95", "opacity-0");
    settingsModal.classList.add("scale-100", "opacity-100");
    settingsPanel.classList.remove("opacity-0");
    settingsPanel.classList.add("opacity-100");
  }, 10);
});

cancelSettingsBtn.addEventListener("click", () => {
  settingsModal.classList.remove("scale-100", "opacity-100");
  settingsModal.classList.add("scale-95", "opacity-0");
  settingsPanel.classList.remove("opacity-100");
  settingsPanel.classList.add("opacity-0");
  setTimeout(() => {
    settingsPanel.classList.add("pointer-events-none", "hidden");
  }, 300);
});

saveSettingsBtn.addEventListener("click", () => {
  const newWorkMinutes = parseFloat(workInput.value);
  const newBreakMinutes = parseFloat(breakInput.value);
  const newLongBreakMinutes = parseFloat(longBreakInput.value);
  const selectedWorkSound = workSoundSelect.value;
  const selectedBreakSound = breakSoundSelect.value;
  
  workEndSound.volume = parseFloat(workVolumeSlider.value);
  breakEndSound.volume = parseFloat(breakVolumeSlider.value);

  autoStartBreak = autoStartBreakCheckbox.checked;
  autoStartWork = autoStartWorkCheckbox.checked;

  if (!isNaN(newWorkMinutes) && newWorkMinutes > 0) {
    workDuration = newWorkMinutes * 60; // convert to seconds
  }
  if (!isNaN(newBreakMinutes) && newBreakMinutes > 0) {
    breakDuration = newBreakMinutes * 60; // convert to seconds
  }

  if (!isNaN(newBreakMinutes) && newBreakMinutes > 0) {
    longBreakDuration = newLongBreakMinutes * 60; // convert to seconds
  }

  currentTime = workDuration;
  updateDisplay();

  if (selectedWorkSound !== "none") {
    workEndSound.src = `./sounds/${selectedWorkSound}`;
  } else {
    workEndSound.src = ""; // disable sound
  }
  
  if (selectedBreakSound !== "none") {
    breakEndSound.src = `./sounds/${selectedBreakSound}`;
  } else {
    breakEndSound.src = "";
  }
  
  settingsModal.classList.remove("scale-100", "opacity-100");
  settingsModal.classList.add("scale-95", "opacity-0");
  settingsPanel.classList.remove("opacity-100");
  settingsPanel.classList.add("opacity-0");
  setTimeout(() => {
    settingsPanel.classList.add("pointer-events-none", "hidden");
  }, 300);
});

function testWorkSound() {
  workEndSound.currentTime = 0;
  workEndSound.volume = parseFloat(workVolumeSlider.value);
  workEndSound.play();
}

function testBreakSound() {
  breakEndSound.currentTime = 0;
  breakEndSound.volume = parseFloat(breakVolumeSlider.value);
  breakEndSound.play();
}
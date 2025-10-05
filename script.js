// --- Configuration ---
let playerName = "";
let answers = {};
const TYPING_DELAY = 1.3; // Time in seconds for the typing animation

const classData = {
    Paladin: {
        flavor: `
        <p class="desc">“Thou art a beacon of valor and righteousness, ever steadfast in the face of darkness!
        Thy heart burneth with unyielding honor, and thy blade defendeth the weak.
        Others look to thee for courage when all hope seems lost.
        Thou walkest a path of discipline, loyalty, and sacred duty — a true guardian of the realm.
        Songs shall be sung of thy gallantry long after the battles have ceased.”</p>

        <p class="traits"><strong>Traits:</strong> Noble, protective, courageous, self-sacrificing.</p>
        <p class="motto">“Duty before glory; light before all.”</p>`,
        imagePath: "paladin.png",
        color: "#e6af2e",
        bgStyle: "radial-gradient(circle, rgba(230,175,46,0.6) 0%, rgba(34,46,35,0) 70%)"
    },

    Sorcerer: {
        flavor: `
        <p class="desc">“The arcane answers thy call, weaving its power through thy very soul!
        Thou art a seeker of truth and mystery, wielding knowledge that bends reality itself.
        Many fear thy brilliance — for thy curiosity knows no bounds, nor doth thy ambition.
        Thy eyes have glimpsed what others dare not dream, and thy power hums like a living flame.
        Beware, for wisdom and madness oft share the same path.”</p>

        <p class="traits"><strong>Traits:</strong> Intelligent, curious, ambitious, enigmatic.</p>
        <p class="motto"> “Through knowledge, all things unfold.”</p>`,
        imagePath: "sorcerer.png",
        color: "#9932CC",
        bgStyle: "radial-gradient(circle, rgba(153,50,204,0.6) 0%, rgba(34,46,35,0) 70%)"
    },

    Assassin: {
        flavor: `
        <p class="desc">“A phantom in the dark, thy strikes silent and precise — unseen yet ever felt.
        Thou trusteth no one, save thy blade and thy wit.
        Cunning and disciplined, thou movest like shadow and breath, leaving naught but whispers behind.
        To enemies, thou art terror incarnate; to allies, a ghostly protector unseen.
        The world shall never know thy name — but it shall forever fear thy silence.”</p>

        <p class="traits"><strong>Traits:</strong> Calculating, patient, loyal only to purpose, master of subtlety.</p>
        <p class="motto">“In silence, I endure. In shadow, I prevail.”</p>`,
        imagePath: "assasin.png",
        color: "#b30000",
        bgStyle: "radial-gradient(circle, rgba(179,0,0,0.6) 0%, rgba(34,46,35,0) 70%)"
    },

    Cleric: {
        flavor: `
        <p class="desc">“A light in the darkness, thou healest both body and spirit.
        Thy compassion is thy weapon, thy faith thy armor.
        Where despair takes root, thou bringest hope; where wounds fester, thou bringest renewal.
        The gods smile upon thee, for thy hands mend what war and sorrow destroy.
        Yet even the purest soul must guard its light, lest it be dimmed by the world’s suffering.”</p>

        <p class="traits"><strong>Traits:</strong> Empathetic, wise, patient, spiritually strong.</p>
        <p class="motto"> “By grace and mercy, I serve the light.”</p>`,
        imagePath: "cleric.png",
        color: "#00CED1",
        bgStyle: "radial-gradient(circle, rgba(0,206,209,0.6) 0%, rgba(34,46,35,0) 70%)"
    }
};

// --- Utility Functions ---

function updateProgress() {
    const countedAnswers = Object.keys(answers).filter(key => key.startsWith('q') && key.length === 2).length; 
    document.querySelectorAll('.crystal').forEach(crystal => {
        const qNum = parseInt(crystal.getAttribute('data-q'));
        if (qNum <= countedAnswers) {
            crystal.classList.add('filled');
        } else {
            crystal.classList.remove('filled');
        }
    });
}

function handleValidationError(elementId, message) {
    console.warn(`[VALIDATION FAILED] Screen: ${elementId}. Error: ${message.replace(/\*/g, '')}`);
    
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('validation-error');
        setTimeout(() => {
            element.classList.remove('validation-error');
        }, 500);
    }

    const msgBox = document.getElementById('messageBox');
    msgBox.innerText = message || "*SELECT AN OPTION TO PROCEED, ADVENTURER!*";
    msgBox.style.display = 'block';
    
    setTimeout(() => {
        msgBox.style.display = 'none';
    }, 2000); 
}

// --- Core Quiz Logic ---

function startQuiz() {
    const nameInput = document.getElementById("playerName");
    const input = nameInput.value.trim();
    
    // **NAME VALIDATION**
    if (!input) {
        handleValidationError("name-panel", "*THOU MUST ENGRAVE A NAME TO BEGIN THE QUEST!*");
        return;
    }
    
    playerName = input.substring(0, 20).toUpperCase();
    
    console.log(`\n=== QUIZ START ===`);
    console.log(`Player Name Set: ${playerName}`);
    
    document.getElementById("startScreen").classList.remove("active");
    document.getElementById("q1Screen").classList.add("active");
    updateProgress();
    
    setTimeout(() => {
        const firstOption = document.querySelector('#q1Screen .option-container input[type="radio"]');
        if (firstOption) {
            firstOption.focus();
        
        }
    }, 600);
}

function nextQuestion(currentId, nextId, inputName) {
    let val;
    let isValid = false;
    let input = document.getElementsByName(inputName);
    let checkedInput = [...input].find(i => i.checked);
    const panelId = inputName + '-panel';

    // **ANSWER VALIDATION**
    if (checkedInput) {
        val = checkedInput.value;
        isValid = true;
    }
    
    if (!isValid) {
        handleValidationError(panelId, "*CHOOSE WISELY, OR THE PATH AHEAD WILL NOT OPEN!*");
        return; // STOP HERE if no answer chosen
    }
    
    answers[inputName] = val;
    
    console.log(`[ANSWERED] ${inputName}: ${val}`);

    // Update UI
    [...input].forEach(i => {
        i.nextElementSibling.setAttribute('aria-checked', i.checked.toString());
    });

    document.getElementById(currentId).classList.remove("active");
    document.getElementById(nextId).classList.add("active");
    
    if (nextId !== 'resultScreen') {
        updateProgress();
        
        setTimeout(() => {
            const firstOption = document.querySelector(`#${nextId} .option-container input[type="radio"]`);
            if (firstOption) {
                firstOption.focus();

            }
        }, 400);
    }
}

function submitQuiz() {
    let q5Input = document.getElementsByName("q5");
    let checkedQ5 = [...q5Input].find(i => i.checked);
    
    // **FINAL QUESTION VALIDATION**
    if (!checkedQ5) {
        handleValidationError("q5-panel", "*ANSWER THE FINAL QUESTION TO SEAL YOUR DESTINY!*");
        return;
    }
    answers["q5"] = checkedQ5.value;
    console.log(`[ANSWERED] q5: ${checkedQ5.value}`);

    // Q4 Fail-safe Check (This should ideally be covered by nextQuestion, but good to have)
    let checkedQ4 = [...document.getElementsByName("q4")].find(i => i.checked);
    if(!checkedQ4) {
         console.error("[CRITICAL ERROR] Q4 answer missing before submit.");
         handleValidationError("q4-panel", "*A PRIOR CHOICE WAS MISSED! RETREAT!*");
         return;
    } else {
         answers["q4Scale"] = parseInt(checkedQ4.value);
    }

    [...q5Input].forEach(i => {
        i.nextElementSibling.setAttribute('aria-checked', i.checked.toString());
    });

    calculateResult();
}

function calculateResult() {
    console.log(`\n=== CALCULATING RESULT ===`);
    console.log("Answers:", JSON.stringify(answers));
    
    const rating = parseInt(answers["q4Scale"]);
    let tally = { Paladin: 0, Sorcerer: 0, Assassin: 0, Cleric: 0 };

    // QUEST I
    if (answers["q1"] === "Paladin") tally.Paladin++;
    if (answers["q1"] === "Sorcerer") tally.Sorcerer++;
    if (answers["q1"] === "Assassin") tally.Assassin++;
    if (answers["q1"] === "Cleric") tally.Cleric++;

    // TRIAL II
    if (answers["q2"] === "Paladin") tally.Paladin++;
    if (answers["q2"] === "Sorcerer") tally.Sorcerer++;
    if (answers["q2"] === "Assassin") tally.Assassin++;
    if (answers["q2"] === "Cleric") tally.Cleric++;

    // TRIAL III
    if (answers["q3"] === "Trust") { // 🌒
        tally.Assassin++;
        tally.Sorcerer++;
    } else if (answers["q3"] === "Distrust") { // ☀️
        tally.Paladin++;
        tally.Cleric++;
    }
    // TRIAL IV (scale)
    if (rating === 1) tally.Assassin++;
    if (rating === 2) { tally.Assassin++; tally.Sorcerer++; }
    if (rating === 3) { tally.Sorcerer++; tally.Paladin++; }
    if (rating === 4) { tally.Paladin++; tally.Cleric++; }
    if (rating === 5) tally.Cleric++;

    // TRIAL V
    if (answers["q5"] === "Paladin") tally.Paladin++;
    if (answers["q5"] === "Sorcerer") tally.Sorcerer++;
    if (answers["q5"] === "Assassin") tally.Assassin++;
    if (answers["q5"] === "Cleric") tally.Cleric++;

    let finalClass = "Paladin"; 
    let maxPoints = -1;
    
    for (const [cls, points] of Object.entries(tally)) {
        if (points > maxPoints) {
            finalClass = cls;
            maxPoints = points;
        } else if (points === maxPoints) {
            const priority = ["Paladin", "Sorcerer", "Cleric", "Assassin"];
            if (priority.indexOf(cls) < priority.indexOf(finalClass)) {
                 finalClass = cls;
            }
        }
    }
    
    console.log(`Tally:`, tally);
    console.log(`FINAL CLASS: ${finalClass} (Score: ${maxPoints})`);

    const resultInfo = classData[finalClass];
    
    document.getElementById("q5Screen").classList.remove("active");
    document.getElementById("progress-bar-container").style.display = 'none';

    const resultScreen = document.getElementById("resultScreen");
    resultScreen.classList.add("active");

    // Thematic Visuals
    // As the background change logic relied on inline styles, i keep the shadow change for visual feedback:
    document.querySelector('.quiz-container').style.boxShadow = `0 0 0 4px ${resultInfo.color}, 4px 4px 0 var(--pixel-border-thick) ${resultInfo.color}`;
    
    // Result Display (Faster Animation)
    const finalClassNameElement = document.getElementById("finalClassName");
    finalClassNameElement.innerText = `Thou art the ${finalClass.toUpperCase()}, ${playerName}!`;
    finalClassNameElement.style.color = resultInfo.color; 

    finalClassNameElement.style.whiteSpace = 'nowrap';
    finalClassNameElement.style.overflow = 'hidden';
    
    const textLength = finalClassNameElement.innerText.length;
    finalClassNameElement.style.animation = `typing ${TYPING_DELAY}s steps(${textLength}, end), blink-caret 2s step-end infinite`; 

    const resultFlavorTextElement = document.getElementById("resultFlavorText");
    resultFlavorTextElement.innerHTML = resultInfo.flavor; // CORRECT: Renders the HTML tags
    const resultImageContainer = document.getElementById("finalClassImage");

    // Staggered fade-in (adjusted delay based on TYPING_DELAY)
    resultFlavorTextElement.style.animation = `fadeIn 1s forwards ${TYPING_DELAY + 0.2}s`;
    resultImageContainer.style.animation = `fadeIn 1.5s forwards ${TYPING_DELAY + 0.2}s`;

    resultImageContainer.style.backgroundImage = `url('${resultInfo.imagePath}')`;
    resultImageContainer.style.backgroundColor = `transparent`;
    resultImageContainer.style.border = `4px solid ${resultInfo.color}`;

    window.scrollTo(0, 0);

    setTimeout(() => {
        resultScreen.querySelector('button').focus();
    }, TYPING_DELAY * 1000 + 1500); 
}

// --- Event Listeners (Keyboard Navigation & Input FIX) ---

document.addEventListener('keydown', (e) => {
    const currentScreen = document.querySelector('.screen.active');
    if (!currentScreen) return; 

    const currentOptions = Array.from(currentScreen.querySelectorAll('input[type="radio"]'));
    const isInputScreen = currentScreen.id === 'startScreen';
    
    if (e.key === 'Enter') {
        
        if (document.activeElement.tagName === 'BUTTON') {
            e.preventDefault(); 
            document.activeElement.click(); 
            return;
        } 
        
        if (isInputScreen && document.activeElement.id === 'playerName') {
             e.preventDefault();
             currentScreen.querySelector('button').click();
             return;
        }
        
        if (currentOptions.length > 0 && document.activeElement.type === 'radio') {
            // When Enter is pressed on a focused radio button,
            // manually check it and then proceed to the next question.
            e.preventDefault();
            document.activeElement.checked = true;
            currentScreen.querySelector('button').click();
            return;
        }
    }
    
    // Handle Arrow/WASD navigation only on screens with radio options
    if (isInputScreen || currentOptions.length === 0) return;

    let currentIndex = currentOptions.findIndex(o => document.activeElement === o);
    if (currentIndex === -1) currentIndex = 0; 
    
    let nextIndex = currentIndex;

    if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % currentOptions.length;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + currentOptions.length) % currentOptions.length;
    }

    if (nextIndex !== currentIndex) {
        currentOptions[nextIndex].focus();
        // REMOVED: currentOptions[nextIndex].checked = true; 
        currentOptions.forEach((opt, index) => {
            // Only update aria-checked for visual feedback, not the actual 'checked' state
            opt.nextElementSibling.setAttribute('aria-checked', (index === nextIndex).toString());
        });
    }
});

// Initial focus on name input when the page loads
document.addEventListener('DOMContentLoaded', () => {
     document.getElementById('playerName').focus();
     console.log("DOM Loaded. Ready to begin quest.");
});

// Re-focus on the first radio button after a screen transition
document.addEventListener('transitionend', (e) => {
    if (e.target.classList.contains('active') && e.target.id.startsWith('q')) {
        const firstOption = document.querySelector(`#${e.target.id} .option-container input[type="radio"]`);
        if (firstOption) {
            firstOption.focus();
            
        }
    }
});

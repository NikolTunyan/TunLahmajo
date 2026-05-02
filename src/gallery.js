const dishes = [
  {
    img: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
    correct: "Lahmajo",
    options: ["Pizza", "Lahmajo", "Pide", "Lavash"]
  },
  {
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    correct: "Grilled Meat",
    options: ["Kebab", "Grilled Meat", "Burger", "Steak"]
  },
  {
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
    correct: "Flatbread",
    options: ["Flatbread", "Pancake", "Pizza", "Crepe"]
  }
];

let current = 0;
let score = 0;
let streak = 0;
let multiplier = 1;

let chefMode = false;
let timer;
let timeLeft = 0;

const img = document.getElementById("dishImage");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

const timerEl = document.getElementById("timer");
const chefBtn = document.getElementById("chefMode");
const card = document.querySelector(".game-card");

/* LOAD */
function loadDish() {
  const dish = dishes[current];

  // GSAP animation
  gsap.fromTo(img,
    { opacity: 0, scale: 0.8, rotate: -5 },
    { opacity: 1, scale: 1, rotate: 0, duration: 0.5 }
  );

  answersBox.innerHTML = "";
  feedback.textContent = "";

  dish.options
    .sort(() => Math.random() - 0.5)
    .forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = opt;

      btn.onclick = () => checkAnswer(opt, dish.correct);

      answersBox.appendChild(btn);
    });

  gsap.fromTo(".answer-btn",
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, stagger: 0.05 }
  );

  if (chefMode) startTimer(7);
}

/* ANSWER */
function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach(b => b.disabled = true);

  if (selected === correct) {
    streak++;

    if (streak >= 3) multiplier = 3;
    else if (streak === 2) multiplier = 2;
    else multiplier = 1;

    const gain = 1 * multiplier;
    score += gain;

    feedback.textContent = `🔥 Correct! +${gain} (x${multiplier})`;
    feedback.style.color = "lime";

    gsap.to(card, { scale: 1.03, duration: 0.1, yoyo: true, repeat: 1 });

  } else {
    streak = 0;
    multiplier = 1;

    feedback.textContent = "❌ Wrong! Streak reset";
    feedback.style.color = "red";
  }

  scoreEl.textContent = `Score: ${score}`;
}

/* NEXT */
nextBtn.onclick = () => {
  current++;
  if (current >= dishes.length) current = 0;
  loadDish();
};

/* CHEF MODE */
chefBtn.onclick = () => {
  chefMode = !chefMode;
  chefBtn.textContent = chefMode ? "🔥 Chef Mode ON" : "🔥 Chef Mode";

  if (!chefMode) {
    clearInterval(timer);
    timerEl.textContent = "";
  }

  loadDish();
};

/* TIMER */
function startTimer(sec) {
  clearInterval(timer);
  timeLeft = sec;

  timerEl.textContent = `⏱ ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱ ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      feedback.textContent = "⏰ Time's up!";
      feedback.style.color = "orange";
    }
  }, 1000);
}

/* 3D TILT */
card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const rotateX = (y - rect.height / 2) / 15;
  const rotateY = (x - rect.width / 2) / 15;

  card.style.transform = `
    perspective(1000px)
    rotateX(${-rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.02)
  `;
});

card.addEventListener("mouseleave", () => {
  card.style.transform = "none";
});

/* INIT */
loadDish();
function startTextAnimation() {
    const letters = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const target = "Will you come to my funeral?";
    const textElement = document.getElementById("text");
    const extra = document.getElementById("extra");
    const btn = document.getElementById("btn");
    const spichkaSound = document.getElementById("spichka-sound"); // элемент аудио
    let iterations = 0;

    let interval = setInterval(() => {
        textElement.innerText = target
            .split("")
            .map((char, index) => {
                if (index < iterations) {
                    return target[index];
                }
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        // Запуск звука за 300 мс (6 итераций по 50мс) до появления огонька
        if (iterations >= target.length - 2 && spichkaSound && spichkaSound.paused) {
            spichkaSound.currentTime = 0;
            spichkaSound.play();
        }

        if (iterations >= target.length) {
            clearInterval(interval);
            // Появление огонька с небольшой задержкой, чтобы звук успел начаться
            setTimeout(() => {
                addFlameOverT();
            }, 300);
        }

        iterations += 1 / 2;
    }, 50);

    setTimeout(() => {
        extra.classList.add("show");
    }, 5000);

    setTimeout(() => {
        btn.classList.add("show1");
    }, 7000);
}


// Адаптация под размер окна
window.addEventListener('resize', () => {
    const canvas = document.getElementById("rain");
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

function fadeOutAll() {
    const fadeDuration = 3; // длительность затухания в секундах
    const now = audioCtx.currentTime;

    const textElement = document.getElementById("text");
    const extra = document.getElementById("extra");
    const btn = document.getElementById("btn");
    const canvas = document.getElementById("rain");
    const video = document.getElementById("outro-video");
    const mainContent = document.getElementById("main-content");

    // Используем Web Audio API для плавного уменьшения громкости
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + fadeDuration);

    // Плавное уменьшение opacity с помощью CSS анимации
    [textElement, extra, btn, canvas].forEach(elem => {
        elem.style.transition = `opacity ${fadeDuration}s linear`;
        elem.style.opacity = 0;
    });

    // Через fadeDuration секунд скрываем элементы полностью и запускаем видео
    setTimeout(() => {
        // Останавливаем звук
        if (source) {
            source.stop();
        }
        // Скрываем основные элементы после анимации
        mainContent.style.display = "none";
        canvas.style.display = "none";

        // Показываем и запускаем видео
        video.style.opacity = 1;
        video.style.pointerEvents = "auto";
        video.play();
    }, fadeDuration * 1000);
}

// Навешиваем обработчик на кнопку
document.getElementById("btn").addEventListener("click", () => {
    fadeOutAll();
});

const doorSound = document.getElementById("door-sound");
const video = document.getElementById("outro-video");

// Параметр: когда воспроизводить звук (секунды)
let doorSoundTime = 0.3;  // например, 5 секунд с начала видео

// Флаг, чтобы не запускать звук несколько раз
let doorSoundPlayed = false;

video.addEventListener("timeupdate", () => {
    if (!doorSoundPlayed && video.currentTime >= doorSoundTime) {
        doorSound.play();
        doorSoundPlayed = true;
    }
});

document.getElementById('intro-screen').addEventListener('click', () => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari и Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }

    // Скрываем экран с *click* (если нужно)
    document.getElementById('intro-screen').style.display = 'none';

    // Запускаем основное действие (например, старт видео, звуков и т.п.)
    startYourMainFunction();
});

const gothicTitles = [
    "antquestions",
    "funeral procession",
    "ashes to ashes",
    "in loving memory",
    "requiem aeternam",
    "no one left",
    "farewell",
    "six feet under",
    "why did you leave?",
    "rest in silence",
    "cursed bloom",
    "black petals fall",
    "eternal night",
    "† closed coffin †",
    "the end is near",
    "goodbye",
];

let currentTitleIndex = 0;
let tempTitle = gothicTitles[0];
let direction = -1; // -1 = удаление, 1 = добавление
let delay = 0; // пауза после полной фразы

function animateTitleCycle() {
    const fullTitle = gothicTitles[currentTitleIndex];

    if (delay > 0) {
        delay--;
        setTimeout(animateTitleCycle, 100);
        return;
    }

    if (direction === -1) {
        // Удаляем по одному символу
        tempTitle = tempTitle.slice(0, -1);
        document.title = tempTitle;

        if (tempTitle.length === 0) {
            direction = 1;
            currentTitleIndex = (currentTitleIndex + 1) % gothicTitles.length;
        }
    } else {
        // Добавляем по одному символу
        const nextLength = tempTitle.length + 1;
        tempTitle = fullTitle.slice(0, nextLength);
        document.title = tempTitle;

        if (tempTitle.length === fullTitle.length) {
            direction = -1;
            delay = 10; // Пауза (10 × 100ms = 1 секунда) перед удалением
        }
    }

    setTimeout(animateTitleCycle, 100);
}

// Старт анимации заголовка
animateTitleCycle();


// Функция, которая добавляет пламя над буквой "t"
function addFlameOverT() {
    const textElement = document.getElementById("text");
    const text = textElement.textContent;
    const tIndex = text.indexOf("t"); // ищем маленькую букву "t"

    if (tIndex === -1) return;

    // Удаляем уже существующее пламя (если есть)
    const existingFlame = textElement.querySelector(".flame");
    if (existingFlame) {
        existingFlame.remove();
    }

    let flame = document.createElement("div");
    flame.className = "flame";

    // Убедимся, что у текста position не static
    if (getComputedStyle(textElement).position === "static") {
        textElement.style.position = "relative";
    }

    textElement.appendChild(flame);

    let range = document.createRange();

    let charCount = 0;
    let textNode = null;
    for (let node of textElement.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (charCount + node.length > tIndex) {
                textNode = node;
                break;
            }
            charCount += node.length;
        }
    }
    if (!textNode) return;

    const localIndex = tIndex - charCount;

    range.setStart(textNode, localIndex);
    range.setEnd(textNode, localIndex + 1);

    let rect = range.getBoundingClientRect();
    let parentRect = textElement.getBoundingClientRect();

    flame.style.left = (rect.left - parentRect.left + rect.width / 2) + "px";
    flame.style.top = (rect.top - parentRect.top - 3) + "px";
    flame.style.transform = "translateX(-50%)";
}

// Запускаем функцию сразу, чтобы пламя появилось моментально
addFlameOverT();


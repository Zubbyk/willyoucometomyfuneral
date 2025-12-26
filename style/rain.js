let audioStarted = false;
let audioCtx, source, gain;

function initAudio() {
    if (audioStarted) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gain = audioCtx.createGain();
    gain.gain.value = 0.5;

    fetch('style/rain.mp3') // убедись, что файл rain.mp3 лежит в папке style/
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = true;
            source.connect(gain).connect(audioCtx.destination);
            source.start();
            audioStarted = true;
        })
        .catch(e => console.error('Ошибка загрузки аудио:', e));
}

document.getElementById('intro-screen').addEventListener('click', function () {
    document.getElementById('intro-screen').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('main-content').classList.add('show');

        initAudio();           // 🔊 запуск реального дождя
        startRainAnimation();  // 💧 визуальный дождь
        startTextAnimation();  // 📝 текст-анимация
    }, 100);
});

function startRainAnimation() {
    const canvas = document.getElementById("rain");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let drops = [];
    for (let i = 0; i < 70; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 4 + 2
        });
    }

    function drawRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#ffffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let drop of drops) {
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
        }
        ctx.stroke();
    }

    function updateRain() {
        for (let drop of drops) {
            drop.y += drop.speed;
            if (drop.y > canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * canvas.width;
            }
        }
    }

    function animate() {
        drawRain();
        updateRain();
        requestAnimationFrame(animate);
    }

    animate();
}

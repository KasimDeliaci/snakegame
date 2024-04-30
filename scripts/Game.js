// Oyun alanını tanımlama canvas bilgileri windowsize'a göre ayarla
const canvas = document.querySelector(".game-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Tuval boyutlarını ayarlama fonksiyonu, canvs elma/yılan boyutlarının tam katı olmalı
function setCanvasSize() {
    const segmentSize = snake.size; // Yılanın her bir segmentinin boyutu
    const aspectRatio = 16 / 9; // Ekran oranı

    // Maksimum genişlik ve yükseklik hesaplamaları
    let maxWidth = Math.floor(window.innerWidth / segmentSize) * segmentSize;
    let maxHeight = Math.floor(window.innerHeight / segmentSize) * segmentSize;

    maxWidth = Math.min(maxWidth, Math.floor(maxHeight * aspectRatio));
    maxHeight = Math.floor(maxWidth / aspectRatio);

    maxWidth = Math.floor(maxWidth / segmentSize) * segmentSize;
    maxHeight = Math.floor(maxHeight / segmentSize) * segmentSize;

    canvas.width = maxWidth;
    canvas.height = maxHeight;
}

// Oyun döngüsü ve hız değişkenleri
let gameInterval;
let gameSpeed = 15; // Başlangıç oyun hızı
const maxSpeed = 70; // Maksimum oyun hızı
let boostSpeed = gameSpeed * 1.25; // Artırılmış hız
let gameSpeedBeforeBoost;
let isBoosting = false; // Hız artırımı durumu
let isStartScreenHidden; // Başlangıç ekranı gizleme durumu

// Sayfa yüklendiğinde başlatılacak işlemler
window.onload = () => {
    setCanvasSize(); // Canvas boyutunu ayarla
    startGameLoop(); // Oyun döngüsünü başlat
    isStartScreenHidden = false; // Başlangıç ekranı gizli değil
}

// 'Başla' butonuna tıklama olayı
document.getElementById('button').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none'; // Başlangıç ekranını gizle
    isStartScreenHidden = true; // Başlangıç ekranı gizleme durumunu güncelle
})

// Oyun döngüsünü başlatma fonksiyonu
function startGameLoop() {
    clearInterval(gameInterval); // Mevcut döngüyü durdur
    gameInterval = setInterval(() => {
        show();
    }, 1000 / gameSpeed); // Belirli hızda yeni döngü başlat
}

// Oyun bitiş durumu
let isGameOver = false;

// Kendine çarpma durumunu kontrol etme
function checkSelfCollision() {
    const head = snake.tail[snake.tail.length - 1];
    for (let i = 0; i < snake.tail.length - 2; i++) {
        if (head.x === snake.tail[i].x && head.y === snake.tail[i].y) { //yılanın vücudu kafasına değiyor mu diye kontrol
            isGameOver = true; // Oyun bitişini tetikle
            break;
        }
    }
}

// Oyun güncellemelerini ve çizimlerini yapma
function show() {
    update(); // Oyun durumunu güncelle
    draw(); // Oyunu çiz
}

// Oyun durumunu güncelleme fonksiyonu
function update() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvası temizle
        snake.move(); // Yılanı hareket ettir
        checkHitWall(); // Duvara çarpma kontrolü
        eatApple(); // Elma yeme işlemi
        checkSelfCollision(); // Kendine çarpma kontrolü
        if (isGameOver) {
            clearInterval(gameInterval); // Oyun döngüsünü durdur
            document.getElementById("gameOver").style.display = "flex"; // Oyun bitiş ekranını göster
            document.getElementById("finalScore").textContent = "Score: " + (snake.tail.length - 1); // Skoru güncelle
            document.querySelector('.game-over-restart').textContent = "Press Enter to restart"; // Yeniden başlatma talimatını güncelle
        }
    }
}

// Elma yeme işlemi
function eatApple() {
    let head = snake.tail[snake.tail.length - 1];
    let nextX = head.x + snake.size * snake.rotate_x;
    let nextY = head.y + snake.size * snake.rotate_y;

    // Eğer elma yenen pozisyona gelirse
    if ((head.x === apple.x && head.y === apple.y) || (nextX === apple.x && nextY === apple.y)) {
        snake.tail.push({x: apple.x, y: apple.y}); // Yılanın kuyruğunu uzat
        updateGameSpeed(); // Oyun hızını güncelle
        apple = new Apple(); // Yeni elma oluştur
    }
}

// Oyun hızını güncelleme
function updateGameSpeed() {
    let currentLength = snake.tail.length; // Yılanın mevcut uzunluğu
    let newSpeed = Math.min(gameSpeed + ((currentLength - 1) / 10) * 0.1, maxSpeed); // Yeni hız hesaplama
    if (newSpeed.toFixed(1) !== gameSpeed.toFixed(1)) {
        gameSpeed = parseFloat(newSpeed.toFixed(1));
        boostSpeed = Math.min(gameSpeed * 1.25);
        clearInterval(gameInterval); // Mevcut döngüyü durdur
        gameInterval = setInterval(show, 1000 / gameSpeed); // Yeni hızda döngüyü başlat
    }
}

// Duvara çarpma kontrolü
function checkHitWall() {
    let head = snake.tail[snake.tail.length - 1];
    if (head.x < 0) head.x = canvas.width - snake.size;
    else if (head.x + snake.size > canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - snake.size;
    else if (head.y + snake.size > canvas.height) head.y = 0;
}

// Renkli arka plan efekti için fonksiyon
function getRainbowColor() {
    const speed = 25; // Renk değişim hızı, randomluk için date sınfının rastgeleliğini kullan
    let r = Math.floor(Math.sin(speed * Date.now() * 0.0001 + 0) * 127 + 128);
    let g = Math.floor(Math.sin(speed * Date.now() * 0.0001 + 2) * 127 + 128);
    let b = Math.floor(Math.sin(speed * Date.now() * 0.0001 + 4) * 127 + 128);
    return `rgb(${r},${g},${b})`; // RGB formatında renk döndür
}

// Oyun alanını çizme fonksiyonu
function draw() {
    const backgroundColor = isBoosting ? getRainbowColor() : "black"; // Boost modundayken renkli, değilse siyah arka plan
    createRect(0, 0, canvas.width, canvas.height, backgroundColor); // Arka planı çiz
    snake.tail.forEach(segment => {
        createRect(segment.x + 2.5, segment.y + 2.5, snake.size - 2.5, snake.size - 2.5, "white"); // Yılan segmentlerini çiz
    });
    ctx.font = "30px Arial"; // Skor metni fontu
    ctx.fillStyle = "#FFFFFF"; // Skor metni rengi
    ctx.fillText("Score: " + (snake.tail.length - 1), canvas.width - 150, 50); // Skoru yaz
    ctx.font = "20px Arial" // Hız metni fontu
    ctx.fillText("Speed: " + (gameSpeed), 30, 50); // Hızı yaz
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color); // Elmayı çiz
}

// Dikdörtgen çizme fonksiyonu
function createRect(x, y, width, height, color) {
    ctx.fillStyle = color; // Doldurma rengi
    ctx.fillRect(x, y, width, height); // Dikdörtgeni çiz
}

// Klavye olaylarına yanıt verme
window.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && isGameOver){
        clearInterval(gameInterval); // Oyun döngüsünü durdur

        // Oyun durum bayraklarını sıfırla
        isGameOver = false;
        isBoosting = false;

        // Oyun hızını normal hıza döndür
        gameSpeed = 15;

        // Oyun bitiş ekranını gizle
        document.getElementById("gameOver").style.display = "none";

        // Tuvali temizle
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Yılanı ve elmayı yeni pozisyonlarla yeniden başlat
        snake = new Snake(20, 20, 20); // Yılanın başlangıç pozisyonu ve boyutu
        apple = new Apple(); // Yeni elma oluştur

        // Oyun döngüsünü yeniden başlat
        startGameLoop();

    }
    else if (event.key === "Shift" && !isBoosting) {
        gameSpeedBeforeBoost = gameSpeed;
        clearInterval(gameInterval); //eski aralığı temizle
        gameSpeed = boostSpeed;
        isBoosting = true;
        startGameLoop();
    }
    else if(!isGameOver && isStartScreenHidden) {
        switch (event.key) {
            case 'a':
                if (snake.rotate_x !== 1) snake.setDirection(-1, 0);
                break;
            case 'w':
                if (snake.rotate_y !== 1) snake.setDirection(0, -1);
                break;
            case 'd':
                if (snake.rotate_x !== -1) snake.setDirection(1, 0);
                break;
            case 's':
                if (snake.rotate_y !== -1) snake.setDirection(0, 1);
                break;
        }
    }
});

// Shift  tuşu bırakma olayına yanıt verme, böylece takılı kalmıyor
window.addEventListener("keyup", (event) => {
    if (event.key === "Shift" && isBoosting) {
        clearInterval(gameInterval);
        gameSpeed = gameSpeedBeforeBoost;
        isBoosting = false;
        startGameLoop();
    }
});

// Yılan ve elma nesnelerinin başlangıç oluşturulması
let snake = new Snake(20, 20, 20); // Yılan nesnesi başlangıç konumu ve boyutu ile oluşturulur
let apple = new Apple(); // Yeni elma nesnesi oluşturulur





class Apple {
    constructor() {
        const margin = snake.size * 2;  // Yılan segmentinin iki katı kadar boşluk
        const maxX = canvas.width - margin;  // Elmanın maksimum x koordinatı
        const maxY = canvas.height - margin;  // Elmanın maksimum y koordinatı
        let isEaten;

        while (true) {
            isEaten = false;
            // Elmanın azaltılmış oyun alanında rastgele pozisyon belirle, köşelerde oluşmaması için güvenli-alanda elmayı yarat
            this.x = Math.floor((Math.random() * (maxX - margin) + margin) / snake.size) * snake.size;
            this.y = Math.floor((Math.random() * (maxY - margin) + margin) / snake.size) * snake.size;

            // Yeni elma pozisyonu yılanın vücuduna çakışıyor mu diye kontrol et
            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x === snake.tail[i].x && this.y === snake.tail[i].y) {
                    isEaten = true;
                    break;
                }
            }

            this.size = snake.size; // Elmanın boyutunu yılanın boyutu olarak ayarla
            this.color = "red"; // Elmanın rengini kırmızı olarak belirle

            if (!isEaten) {
                break; // Eğer elma yılanın vücuduyla çakışmıyorsa döngüden çık
            }
        }
    }
}
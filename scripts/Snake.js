class Snake {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.tail = [{x: this.x, y: this.y}]; // Yılanın başlangıç konumu ve boyutu obje nesnesi
        this.rotate_x = 0;
        this.rotate_y = 1;
        this.nextRotate_x = 0;  // Gelecek dönüş için x yönü
        this.nextRotate_y = 1;  // Gelecek dönüş için y yönü
    }

    // Yılanın hareket etme fonksiyonu
    move() {
        // Mevcut yönün tam tersi olmadığı sürece yönü güncelle
        if (!(this.rotate_x === -this.nextRotate_x && this.rotate_x !== 0) &&
            !(this.rotate_y === -this.nextRotate_y && this.rotate_y !== 0)) {
            this.rotate_x = this.nextRotate_x;
            this.rotate_y = this.nextRotate_y;
        }

        // Yeni kare pozisyonunu hesapla ve kuyruğa ekle
        let newRect = {
            x: this.tail[this.tail.length - 1].x + this.size * this.rotate_x,
            y: this.tail[this.tail.length - 1].y + this.size * this.rotate_y
        };

        this.tail.shift(); // Eski kareyi kuyruktan çıkar
        this.tail.push(newRect); // Yeni kareyi kuyruğa ekle
    }

    // Yön belirleme fonksiyonu
    setDirection(x, y) {
        this.nextRotate_x = x;
        this.nextRotate_y = y;
    }
}
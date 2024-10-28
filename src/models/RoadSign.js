// Імпортуємо необхідні модулі
import * as THREE from 'three';

export default function createRoadSign(textureLoader, signText = 'Your Destination') {
    // 1. Створення текстури для вказівника
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;

    // Налаштування тексту
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(signText, canvas.width / 2, canvas.height / 2);

    // Створення текстури з канвасу
    const signTexture = new THREE.CanvasTexture(canvas);

    // 2. Створення матеріалу та геометрії для вказівника
    const signGeometry = new THREE.PlaneGeometry(2, 1);
    const signMaterial = new THREE.MeshBasicMaterial({ map: signTexture, side: THREE.DoubleSide });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 2, 0); // позиціонуємо табличку над землею

    // 3. Створення стовпа
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(0, 1, 0); // центр стовпа на висоті 1

    // 4. Створення групи для вказівника та стовпа
    const roadSign = new THREE.Group();
    roadSign.add(sign);
    roadSign.add(pole);

    // 5. Налаштування положення об'єктів
    sign.position.y = pole.position.y + 1.5;

    return roadSign;
}

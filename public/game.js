import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNTCy8gbIDCIrfExSRGqMztZI-bepGSoc",
  authDomain: "silly-lil-game.firebaseapp.com",
  projectId: "silly-lil-game",
  storageBucket: "silly-lil-game.firebasestorage.app",
  messagingSenderId: "582873403102",
  appId: "1:582873403102:web:6e5ecf2b19bb90ba587c4f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Game State
let ship = { x: 400, y: 50, vx: 0, vy: 0, angle: 0, thrust: false };
let gravity = 0.05;
let score = 0;
let timeLeft = 180;
let landingZones = [{ x: 350, w: 100, y: 580 }];

// Fun Easter Egg: If user types "SETH" in initials, ship turns gold
let achievements = [];

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Stars
    ctx.fillStyle = "white";
    for(let i=0; i<50; i++) ctx.fillRect(Math.random()*800, Math.random()*600, 1, 1);

    // Physics
    if (ship.thrust) {
        ship.vx += Math.sin(ship.angle) * 0.15;
        ship.vy -= Math.cos(ship.angle) * 0.15;
    }
    ship.vy += gravity;
    ship.x += ship.vx;
    ship.y += ship.vy;

    // Draw Ship
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.strokeStyle = "#00ffcc";
    ctx.strokeRect(-10, -10, 20, 20); // Simple box ship
    if(ship.thrust) {
        ctx.fillStyle = "orange";
        ctx.fillRect(-5, 10, 10, 10);
    }
    ctx.restore();

    // Collision Logic (Simplified)
    if (ship.y > 570) {
        checkLanding();
    }

    requestAnimationFrame(draw);
}

function checkLanding() {
    let zone = landingZones[0];
    if (ship.x > zone.x && ship.x < zone.x + zone.w && ship.vy < 1.5) {
        score += 100;
        resetShip();
    } else {
        // Crash!
        resetShip();
        score = Math.max(0, score - 50);
    }
}

function resetShip() {
    ship = { x: 400, y: 50, vx: 0, vy: 0, angle: 0, thrust: false };
}

// Input listeners
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') ship.angle -= 0.1;
    if (e.code === 'ArrowRight') ship.angle += 0.1;
    if (e.code === 'Space' || e.code === 'ArrowUp') ship.thrust = true;
});
window.addEventListener('keyup', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') ship.thrust = false;
});

draw();

const confettiContainer = document.getElementById('confetti');
const countdownEl = document.getElementById('countdown');
const blowOutBtn = document.getElementById('blowOutBtn');
const candleFlame = document.getElementById('candleFlame');
const surpriseMessage = document.getElementById('surpriseMessage');
const playMusicBtn = document.getElementById('playMusicBtn');
const pauseMusicBtn = document.getElementById('pauseMusicBtn');
const audioStatus = document.getElementById('audioStatus');
const galleryUpload = document.getElementById('galleryUpload');
const gallery = document.getElementById('gallery');
const stickerButtons = document.querySelectorAll('.sticker-button');
const guestMessage = document.getElementById('guestMessage');
const addGuestBtn = document.getElementById('addGuestBtn');
const guestEntries = document.getElementById('guestEntries');
const guestCount = document.getElementById('guestCount');
const fireworksContainer = document.getElementById('fireworks');
const giftBox = document.getElementById('giftBox');
const unwrapBtn = document.getElementById('unwrapBtn');
const giftReveal = document.getElementById('giftReveal');

let selectedSticker = '🎉';
let audioContext;
let isPlaying = false;
let oscillatorNodes = [];
let currentBirthDate = getNextBirthdayHour();

function getNextBirthdayHour() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(20, 0, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

function createConfetti() {
  const colors = ['#ff6ec7', '#61f7ff', '#ffd43b', '#8cff94', '#e782ff'];
  for (let i = 0; i < 160; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = Math.floor(Math.random() * 10) + 6;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 0.4}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.opacity = `${0.6 + Math.random() * 0.4}`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.animation = `fall ${4 + Math.random() * 4}s linear ${Math.random() * 2}s infinite`;
    confettiContainer.appendChild(piece);
  }
}

function updateCountdown() {
  const now = new Date();
  const diff = currentBirthDate - now;
  if (diff <= 0) {
    countdownEl.textContent = 'It’s time to celebrate!';
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownEl.textContent = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

function playCelebrationTune() {
  if (isPlaying) return;
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 523.25];
  const now = audioContext.currentTime;

  notes.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = freq;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0.0001, now + index * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.35 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.35 + 0.32);
    oscillator.start(now + index * 0.35);
    oscillator.stop(now + index * 0.35 + 0.34);
    oscillatorNodes.push(oscillator);
  });

  isPlaying = true;
  audioStatus.textContent = 'Celebration tune is playing!';
  setTimeout(() => {
    isPlaying = false;
    audioStatus.textContent = 'Enjoy the tune or press play again.';
  }, notes.length * 350 + 250);
}

function stopCelebrationTune() {
  if (!audioContext) return;
  oscillatorNodes.forEach(node => {
    try { node.stop(); } catch {};
  });
  oscillatorNodes = [];
  isPlaying = false;
  audioStatus.textContent = 'Music paused.';
}

function handleBlowOut() {
  candleFlame.style.display = 'none';
  surpriseMessage.textContent = 'You blew out the candle! Your secret surprise is: a sparkling new year of bright adventures!';
  blowOutBtn.textContent = 'Wish Granted';
  blowOutBtn.disabled = true;
}

function selectSticker(event) {
  stickerButtons.forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
  selectedSticker = event.currentTarget.dataset.sticker;
}

function addGuestbookEntry() {
  const messageText = guestMessage.value.trim();
  if (!messageText) return;
  const entry = document.createElement('div');
  entry.className = 'entry';
  entry.innerHTML = `
    <div class="entry-header">
      <span class="sticker">${selectedSticker}</span>
      <span class="entry-time">Just now</span>
    </div>
    <p class="entry-message">${escapeHtml(messageText)}</p>
  `;
  guestEntries.prepend(entry);
  guestMessage.value = '';
  updateGuestCount();
}

function updateGuestCount() {
  const count = guestEntries.children.length;
  guestCount.textContent = count;
  if (count >= 10) {
    launchFireworks();
  }
}

function launchFireworks() {
  if (fireworksContainer.classList.contains('active')) return;
  fireworksContainer.classList.add('active');
  for (let i = 0; i < 18; i++) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    const x = Math.random() * 100;
    const y = Math.random() * 80 + 10;
    firework.style.left = `${x}%`;
    firework.style.top = `${y}%`;
    firework.style.background = `radial-gradient(circle, ${randomFireworkColor()} 0%, transparent 70%)`;
    firework.style.animationDelay = `${Math.random() * 0.7}s`;
    fireworksContainer.appendChild(firework);
    setTimeout(() => firework.remove(), 1700);
  }
  setTimeout(() => fireworksContainer.classList.remove('active'), 2200);
}

function randomFireworkColor() {
  const colors = ['#ff5e9e', '#6dfffe', '#ffca5f', '#d5a6ff', '#8cff95'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function handleGalleryUpload(event) {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      img.alt = file.name;
      gallery.prepend(img);
    };
    reader.readAsDataURL(file);
  });
}

function revealGift() {
  giftBox.classList.add('unwrapped');
  giftReveal.textContent = 'Surprise! You received a year filled with bright moments and cherished memories.';
  unwrapBtn.disabled = true;
}

function init() {
  createConfetti();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  blowOutBtn.addEventListener('click', handleBlowOut);
  playMusicBtn.addEventListener('click', playCelebrationTune);
  pauseMusicBtn.addEventListener('click', stopCelebrationTune);
  galleryUpload.addEventListener('change', handleGalleryUpload);
  stickerButtons.forEach(btn => btn.addEventListener('click', selectSticker));
  addGuestBtn.addEventListener('click', addGuestbookEntry);
  unwrapBtn.addEventListener('click', revealGift);
  giftBox.addEventListener('click', revealGift);

  setTimeout(() => {
    try {
      playCelebrationTune();
    } catch (error) {
      audioStatus.textContent = 'Tap Play to hear the birthday tune.';
    }
  }, 450);
}

window.addEventListener('DOMContentLoaded', init);

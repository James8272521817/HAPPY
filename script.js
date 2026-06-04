// script.js — small confetti + mailto + utilities
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');
let W, H;
function resize() { W = confettiCanvas.width = innerWidth; H = confettiCanvas.height = innerHeight; }
addEventListener('resize', resize); resize();

// simple confetti particles
const colors = ['#ff6b81','#ffd166','#06d6a0','#4aa6ff','#c77dff'];
let particles = [];
function makeParticle(){
  return {
    x: Math.random()*W,
    y: -10,
    vx: (Math.random()-0.5)*4,
    vy: 2+Math.random()*4,
    r: 6+Math.random()*8,
    color: colors[Math.floor(Math.random()*colors.length)],
    rot: Math.random()*360,
    vr: (Math.random()-0.5)*8
  }
}
function spawn(n=40){ for(let i=0;i<n;i++) particles.push(makeParticle()); }
function update(){
  ctx.clearRect(0,0,W,H);
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rot += p.vr;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
    ctx.fillStyle = p.color; ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
    ctx.restore();
    if(p.y>H+50) particles.splice(i,1);
  }
  requestAnimationFrame(update);
}
update();

document.getElementById('confettiBtn').addEventListener('click', ()=>{ spawn(120); });

// Music: simple WebAudio synth that plays "Happy Birthday"
const musicBtn = document.getElementById('musicBtn');
let audioCtx = null;
let musicPlaying = false;
let musicTimeouts = [];

function noteToFreq(note){
  // note like C4, A4
  const semitones = {C: -9, 'C#': -8, D: -7, 'D#': -6, E: -5, F: -4, 'F#': -3, G: -2, 'G#': -1, A: 0, 'A#': 1, B: 2};
  const pitch = note.replace(/(\d+)$/,'');
  const octave = parseInt(note.match(/(\d+)$/)[0],10);
  const a4 = 440;
  const semitoneOffset = semitones[pitch] + (octave - 4) * 12;
  return a4 * Math.pow(2, semitoneOffset/12);
}

const hbMelody = [
  ['G4',0.5],['G4',0.5],['A4',1],['G4',1],['C5',1],['B4',2],
  ['G4',0.5],['G4',0.5],['A4',1],['G4',1],['D5',1],['C5',2],
  ['G4',0.5],['G4',0.5],['G5',1],['E5',1],['C5',1],['B4',1],['A4',2],
  ['F5',0.5],['F5',0.5],['E5',1],['C5',1],['D5',1],['C5',2]
];

function playNote(freq, dur, timeOffset=0){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + timeOffset);
  gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + timeOffset + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + timeOffset + dur - 0.02);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime + timeOffset);
  osc.stop(audioCtx.currentTime + timeOffset + dur + 0.02);
}

function playHappyBirthday(loop=false){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let t = 0; const tempo = 0.45; // seconds per beat
  hbMelody.forEach(([note,beats],i)=>{
    const freq = noteToFreq(note);
    const dur = beats * tempo;
    const to = setTimeout(()=> playNote(freq,dur), t*1000);
    musicTimeouts.push(to);
    t += dur;
  });
  if(loop){
    const loopTo = setTimeout(()=>{ if(musicPlaying) playHappyBirthday(true); }, t*1000);
    musicTimeouts.push(loopTo);
  }
}

function stopMusic(){ musicTimeouts.forEach(id=>clearTimeout(id)); musicTimeouts=[]; }

musicBtn.addEventListener('click', ()=>{
  if(!musicPlaying){
    musicPlaying = true; musicBtn.textContent='Playing 🎵';
    playHappyBirthday(true);
  } else {
    musicPlaying = false; musicBtn.textContent='Play Music 🎵'; stopMusic();
  }
});

const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

function getMessage(){ return document.getElementById('message').innerText.trim(); }



copyBtn.addEventListener('click', async ()=>{
  try{ await navigator.clipboard.writeText(getMessage()); copyBtn.textContent='Copied ✔'; setTimeout(()=>copyBtn.textContent='Copy Message',1600);}catch(e){alert('Copy failed — select and copy manually');}
});

downloadBtn.addEventListener('click', ()=>{
  const html = `<!doctype html>\n<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Happy 17th Birthday</title><style>${document.querySelector('link[rel=stylesheet]')? `/* open local styles.css alongside*/` : ''}</style></head><body><pre>${escapeHtml(getMessage())}</pre><script>/* This exported page includes text only; music uses WebAudio and is not embedded. */</script></body></html>`;
  const blob = new Blob([html],{type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='happy-17-birthday.html'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

// Autoplay attempt: try to start music and confetti when page opens.
function initAutoplay(){
  try{ if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){/* ignore */}
  musicPlaying = true;
  playHappyBirthday(true);
  spawn(160);
  // If audio is suspended by browser, wait for user gesture to resume
  if(audioCtx && audioCtx.state === 'suspended'){
    const resume = ()=>{
      audioCtx.resume().then(()=>{ if(musicPlaying){ stopMusic(); playHappyBirthday(true); } });
      window.removeEventListener('click', resume);
      window.removeEventListener('touchstart', resume);
    };
    window.addEventListener('click', resume);
    window.addEventListener('touchstart', resume);
  }
}

window.addEventListener('load', ()=>{ initAutoplay(); });

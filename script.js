// Select elements
const envelope = document.getElementById('envelope');
const letterSection = document.getElementById('letter-section');
const letterText = document.getElementById('letter-text');

// Letter content
const message = HI BEBYY HAPPYY HAPPYY BIRTHDAYY MY LOVEYY DOVEYYY JILLLYY SAVIIEEEE BEBYYYKOOOO, UHMMM SANA POI MATUPAD MO LAHAT NG PANGARAP MO AT PANGARAP NTIN AT WISH KO PO NA MAS MAGING HEALTHY KA PA PO LIKE MORE CHUBBYY CUTIEE HEHEHE AND I LOVE YOU VERYY VERYY MUCCHHH , IMISS YOUUU MYLOVEEE MWMAMWMAMWAMMWMMW;

// Typewriter effect
function typeWriter(text, element, speed = 50) {
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}

// Envelope click event
envelope.addEventListener('click', () => {
    envelope.classList.add('open');

    // Show letter after animation
    setTimeout(() => {
        letterSection.style.display = 'flex';
        typeWriter(message, letterText);
        launchConfetti();
    }, 1000);
});

// Simple confetti
function launchConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ['#ff6fa3','#a36fff','#ffd1dc','#c1b3f1','#a0e7f3'];

    for(let i=0; i<150; i++){
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 150 + 50,
            color: colors[Math.floor(Math.random()*colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        confetti.forEach((c, i) => {
            ctx.beginPath();
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r/2, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r/2);
            ctx.stroke();
        });
        update();
    }

    function update() {
        confetti.forEach((c, i) => {
            c.tiltAngle += c.tiltAngleIncremental;
            c.y += (Math.cos(c.d) + 3 + c.r/2)/2;
            c.tilt = Math.sin(c.tiltAngle) * 15;

            if(c.y > canvas.height){
                c.y = -10;
                c.x = Math.random() * canvas.width;
            }
        });
    }

    setInterval(draw, 20);
}

// Floating hearts and sparkles
const particlesContainer = document.getElementById('particles');
function createParticle(type){
    const particle = document.createElement('div');
    particle.classList.add('particle', type);
    particle.style.left = Math.random()*100 + 'vw';
    particle.style.animationDuration = (Math.random()*3 + 2) + 's';
    particle.style.opacity = Math.random();
    particlesContainer.appendChild(particle);
    setTimeout(()=>particlesContainer.removeChild(particle), 5000);
}
setInterval(()=>{ createParticle('heart'); createParticle('sparkle'); }, 500);

// Particle styles
const style = document.createElement('style');
style.innerHTML = `
.particle {
    position: absolute;
    top: 100%;
    font-size: 1.5rem;
    pointer-events: none;
}
.heart::before { content: '💖'; }
.sparkle::before { content: '✨'; }
`;
document.head.appendChild(style);

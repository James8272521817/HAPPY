const message =
"HI BEBYY HAPPYY HAPPYY BIRTHDAYY MY LOVEYY DOVEYYY JILLLYY SAVIIEEEE BEBYYYKOOOO, UHMMM SANA POI MATUPAD MO LAHAT NG PANGARAP MO AT PANGARAP NTIN AT WISH KO PO NA MAS MAGING HEALTHY KA PA PO LIKE MORE CHUBBYY CUTIEE HEHEHE AND I LOVE YOU VERYY VERYY MUCCHHH , IMISS YOUUU MYLOVEEE MWMAMWMAMWMAMWAMMWMMW";

function openLetter(){

document.getElementById('letter').classList.remove('hidden');

let i=0;
const text=document.getElementById('typedText');
text.innerHTML='';

const typing=setInterval(()=>{
text.innerHTML+=message.charAt(i);
i++;

if(i>=message.length){
clearInterval(typing);
}
},40);

for(let x=0;x<40;x++){
createHeart();
}
}

function createHeart(){

const heart=document.createElement('div');

heart.className='heart';
heart.innerHTML='💖';

heart.style.left=Math.random()*100+'vw';

document.body.appendChild(heart);

setTimeout(()=>{
heart.remove();
},5000);
}

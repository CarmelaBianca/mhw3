function check(event) {
    const divCliccato= event.currentTarget;
    const image = divCliccato.querySelector('.checkbox');
    const questionId=divCliccato.dataset.questionId;
    const choiceId=divCliccato.dataset.choiceId;
    const divs = document.querySelectorAll('[data-question-id='+questionId+']');
    for (let div of divs){
        div.querySelector('.checkbox').src='images/unchecked.png';
        div.classList.add('overlay');
        div.classList.remove('sfondo');
    }
    divCliccato.classList.add('sfondo');
    divCliccato.classList.remove('overlay');
    image.src = 'images/checked.png';

    const fine=stopListener(questionId, choiceId);
    if (fine){
        const result = CalcoloPersonalita(scelte);
        visualizzaPersonalita(result);
    }
}


function stopListener(questionId, choiceId){
    const divListening=document.querySelectorAll('.choice-grid div');
    scelte[questionId]=choiceId;
    if(scelte.one !== null && scelte.two !== null && scelte.three !== null){
        for (let div of divListening){
            div.removeEventListener('click', check);
        }
        return 1;
    } 
}


function CalcoloPersonalita(scelte){
    if(scelte.one === scelte.two || scelte.one === scelte.three)
    return scelte.one;
    else if(scelte.two === scelte.three)
    return scelte.two;
    else if (scelte.one !== scelte.two && scelte.one !== scelte.three)
    return scelte.one;
}

function visualizzaPersonalita(result){
    const h1 = document.querySelector('h1.r');
    const p = document.querySelector('p.r');
    h1.textContent = RESULTS_MAP[result].title;
    p.textContent = RESULTS_MAP[result].contents;
    document.querySelector('.hidden').classList.remove('hidden');
    const btn_restart = document.querySelector('#restart');
    btn_restart.addEventListener('click', restart);
}

function restart(){
    const btn = document.querySelector('#btn');
    btn.classList.add('hidden');
    const divs = document.querySelectorAll('.choice-grid div');
    const images = document.querySelectorAll('.checkbox');
    for (let div of divs){
        div.addEventListener('click', check);
        div.classList.remove('overlay');
        div.classList.remove('sfondo');
      }
    for(let image of images){
      image.src = 'images/unchecked.png';
    }
    scelte.one=null;
    scelte.two=null;
    scelte.three=null;
    window.scrollTo(0,0);
}

function onResponse(response){
    if (API==='HP'){
        if (response.ok===false){
            const result=document.querySelector('#risultati');
            result.classList.remove('hidden');
            const p=document.createElement('p');
            p.textContent='Il sito è offline per manutenzione (guardi il power point)';
            result.appendChild(p);
        }
    }
    return response.json();
}

function onJson(json){
    characters=json;
}

function onFailed(error){
     console.log('Fallito: '+error);
}

 
function url(event){
    const element = event.currentTarget;
    const f=document.querySelector('form');
    const result=document.querySelector('#risultati');
    result.innerHTML='';
    f.classList.remove('hidden');
    let rest_url = 'null';
    if (element.id==='BB'){
        rest_url ='https://www.breakingbadapi.com/api/characters';
        fetch(rest_url).then(onResponse, onFailed).then(onJson);
    }else if(element.id==='HP'){
        rest_url ='http://hp-api.herokuapp.com/api/characters';
        fetch(rest_url, {mode: 'no-cors'}).then(onResponse, onFailed).then(onJson);
    }else{
        const email='carmela.bianca.sr@gmail.com';
        const password='mhw32022';
        fetch("https://kitsu.io/api/oauth/token",{
            method: "post",
            body: 'grant_type=password&username=' + email+ '&password=' +password,
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        ).then(onTokenResponse).then(onTokenJson);
    }
    API = element.id; 
    
}
function onTokenResponse(response)
{
  return response.json();
}
function onTokenJson(json)
{
  token = json.access_token;
}
function search(event){
    event.preventDefault();
    const text=document.querySelector('#name').value;
    const result=document.querySelector('#risultati');
    result.innerHTML='';
    if (API==='HP'){
        Harry_potter_characters(text, result);
    }
    if (API==='BB'){
        Breaking_bad_characters(text, result);
    }
    if (API==='A'){
        anime(text);
    }
}
function onJsonOAuth(json) {
    const r = json.data[0];
    const result=document.querySelector('#risultati');
    let paragrafi=[];
    const copertina=document.createElement('img');
    const titolo=document.createElement('h1');
    result.classList.remove('hidden');
    for (let i=0; i<4; i++){
        paragrafi[i]=document.createElement('p');
    }
    titolo.textContent=r.attributes.canonicalTitle;
    result.appendChild(titolo);
    paragrafi[0].textContent=r.attributes.description;
    paragrafi[1].textContent=r.attributes.createdAt;
    paragrafi[2].textContent=r.attributes.titles.ja_jp;
    paragrafi[3].textContent=r.attributes.ageRatingGuide;
    for (let i=0; i<4; i++){
       result.appendChild( paragrafi[i]);
    }
    copertina.src=r.attributes.posterImage.small;
    result.appendChild(copertina);
}
function Harry_potter_characters(text, result){
    const personaggio_scelto = {
        name:'null',
        gender:'null',
        house:'null',
        dateOfBirth:'null',
        eyeColour:'null',
        patronus:'null',
        actor:'null',
        image:'null'
    }
    result.classList.remove('hidden');
    let exist = false, j=0;
    let paragrafi=[];
    for (let c in characters){
       if (characters[c]['name']===text){
           exist = true;
           for (let i in personaggio_scelto){
               personaggio_scelto[i]=characters[c][i];
               paragrafi[j]=document.createElement('p');
               paragrafi[j].textContent=personaggio_scelto[i];
               if (j<7)
                   result.appendChild(paragrafi[j]);
               j++;
           }
           const img=document.createElement('img');
           img.src=personaggio_scelto['image'];
           result.appendChild(img);
        }
    } 
    if (!exist){
        const p=document.createElement('p');
        p.textContent='Il personaggio non è stato trovato';
        result.appendChild(p);
    }
}

function Breaking_bad_characters(text, result){
    const personaggio_scelto = {
        name:'null',
        birthday:'null',
        img:'null',
        status:'null',
        nickname:'null',
        portrayed:'null'
    }
    result.classList.remove('hidden');
    let exist = false, j=0;
    let paragrafi=[];
    for (let c in characters){
       if (characters[c]['name']===text){
           exist = true;
           for (let i in personaggio_scelto){
               personaggio_scelto[i]=characters[c][i];
               paragrafi[j]=document.createElement('p');
               paragrafi[j].textContent=personaggio_scelto[i];
               if (j!==2)
                   result.appendChild(paragrafi[j]);
               j++;
           }
           const img=document.createElement('img');
           img.src=personaggio_scelto['img'];
           result.appendChild(img);
        }
    } 
    if (!exist){
        const p=document.createElement('p');
        p.textContent='Il personaggio non è stato trovato';
        result.appendChild(p);
    }
}
function anime(text){
    fetch("https://kitsu.io/api/edge/anime?filter[text]=" + text,  
      {
        headers:
        {
          'Authorization': 'Bearer ' + token
        }
      }
    ).then(onResponse).then(onJsonOAuth);
}

const divs=document.querySelectorAll('.choice-grid div');
for (let d of divs){
    d.addEventListener('click', check);
}
let scelte={
    'one':null,
    'two':null,
    'three':null
}
const Breaking_bad = document.getElementById('BB');
const Harry_potter = document.getElementById('HP');
const Anime = document.getElementById('A');
const form = document.querySelector('form');
let characters;
let API;
let token;

Breaking_bad.addEventListener('click', url);
Harry_potter.addEventListener('click', url);
Anime.addEventListener('click', url);
form.addEventListener('submit', search);


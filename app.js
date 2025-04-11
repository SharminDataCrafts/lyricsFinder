let searchBtn = document.getElementById('btn');
let inputField = document.getElementById('inp-field');
let suggestionBox = document.getElementById('suggestions-box');
let songCard = document.getElementById('song-card');

searchBtn.addEventListener('click',()=>{
    if(inputField.value!=''){
        let query = inputField.value;
        displaySong(query);        
    }else{
        inputField.focus();
    }
});

let query ='';
inputField.addEventListener('input',()=>{
    query = inputField.value;
    if(query.length>=3){
        fetchSuggestions(query);
    }
    suggestionBox.innerHTML = '';
});

function fetchSuggestions(query){
    fetch(`https://api.lyrics.ovh/suggest/${query}`)
        .then(res=>res.json())
        .then(data=>{
            suggestionBox.style.display = 'inline';
            let elements = data.data
            for(let i=0; i<5&&i<elements.length; i++){
                const suggestion = document.createElement('div');
                suggestion.innerHTML = elements[i].title + `<br>`;

                suggestion.style.borderBottom = '1px solid ';
                suggestion.style.cursor = 'pointer';

                suggestionBox.appendChild(suggestion);

                suggestion.addEventListener('click',()=>displaySong(elements[i].title));
            }
        })
    
}

function displaySong(query){
    fetch(`https://api.lyrics.ovh/suggest/`+ encodeURIComponent(query))
    .then(res=>res.json())
    .then(data=>{
        const song = data.data[0].title;
        const artist = data.data[0].artist.name;
        const imgSrc = data.data[0].album.cover;
        const music =data.data[0].preview;

        songCard.innerHTML += ` <div class="single-result row align-items-center my-3 p-3">
                    <div class="col-md-9">
                       <div class="row">
                            <div class="col-md-3">
                                <img src="${imgSrc}" class="rounded-3" alt="">
                            </div>
                            <div class="col-md-8 my-auto">
                                <h3 class="lyrics-name">${song}</h3>
                                <p class="author lead">Album by <span>${artist}</span></p>
                                <div class="row" d-flex flex-column mb-3>
                                    
                                        <p>🎵 Song Preview </p>
                                        <audio controls src="${music}" type="audio/mp3">
                                        </audio>
                             
                                </div>
                            </div>
                       </div>
                    </div>
                    <div class="col-md-3 text-md-right text-center">
                        <button class="btn btn-success" id="lyrics-btn" onClick="getLyrics('${artist}', '${song}')">Get Lyrics</button>
                    </div>
                </div>`;

        suggestionBox.innerHTML = '';
        inputField.value='';  

        
    })
    .catch(()=>{
        suggestionBox.innerHTML = 'Something Went Wrong!! Please try again later!';
    });
}

function getLyrics(artist,song){
    fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`)
    .then(res=>{
        if(!res.ok){
            throw new Error('Failed to fetch lyrics');
        }
        return res.json()
    })
    .then(data=>{  
        document.getElementById('lyrics-card').innerText = data.lyrics;
     })
     .catch(()=>{
        document.getElementById('lyrics-card').innerText = 'Sorry, we could not find the lyrics for this song. Please try again later!';
     });
}
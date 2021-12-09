const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btns = document.querySelectorAll('.btn');

var model = undefined;
var captureImage;

var myLicorne = undefined;

function startStreamVideo(){

    if (myLicorne != undefined) {
        myLicorne.remove();
        myLicorne == undefined;
    }

    handleVideoFrame(1);
    document.querySelector('#showme').play();

    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    }).then(stream => {
        video.srcObject = stream;
    }).catch(console.error);

    captureImage = setInterval(myTimer,1000);

};

function imageRecognition(){

    
    // detect objects in the image.
    model.detect(canvas).then(predictions => {
        console.log('Predictions: ', predictions);
        for (let n = 0; n < predictions.length; n++) {
            // If we are over 66% sure we are sure we classified it right, draw it!
            if (predictions[n].score > 0.66) {
                var result = document.querySelector('.result');
                var objectClass = predictions[n].class;
                if(objectClass !== 'undefined') {
                    result.innerHTML = predictions[n].class  + ' - with ' 
                    + Math.round(parseFloat(predictions[n].score) * 100) 
                    + '% confidence.';
                }
            }
        }
    });
}

function stopStreamedVideo() {

    clearInterval(captureImage);
    handleVideoFrame(0);
    document.querySelector('#bye').play();

    const tracks = video.srcObject.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });
    video.srcObject = null;

    var img = document.createElement("img");
    img.src = "img/licorne.jpg"
    var maDiv = document.getElementById("licorne");
    maDiv.innerHTML = '';
    maDiv.appendChild(img);
    myLicorne = img;

};


function myTimer(){
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    imageRecognition();
    //console.log(canvas);
}

function playAudio(){
    document.querySelector('#hello').play();
}

function handleVideoFrame(state){
    const frame = document.getElementById('video-frame');
    const order = document.querySelector('.order');
    const prediction = document.querySelector('.prediction');
    const loader = document.getElementById('loader');

    if(state === 0){
        frame.setAttribute("style", "cursor:help");
        frame.addEventListener('mouseover', playAudio);
        video.classList.add('hidden');
        order.classList.add('hidden');
        prediction.classList.add('hidden');
    } else {
        frame.setAttribute("style", "cursor:inherit");
        frame.removeEventListener('mouseover', playAudio);
        video.classList.remove('hidden');
        order.classList.remove('hidden');
        prediction.classList.remove('hidden');
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed.');

    //Load model and hide loader
    cocoSsd.load().then(function (loadedModel) {
        model = loadedModel;
        console.log('Model fully loaded. Nono is ready!');
        if(model !== undefined){
            document.getElementById('loader').classList.add('hidden');
            for(i =0 ; i < btns.length; i++){
                btns[i].classList.remove('hidden');
            }
        }
    });

    handleVideoFrame(0);
    document.querySelector('#btn-start').addEventListener('click', startStreamVideo);
    document.querySelector('#btn-stop').addEventListener('click', stopStreamedVideo);
});
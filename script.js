
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
var nono = 'OFF';

var captureImage;

function startStreamVideo(){

    nono = 'ON';
    videoFrame();
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

    var result = document.querySelector('.result');

    // Load the model.
    cocoSsd.load().then(model => {
    // detect objects in the image.
    model.detect(canvas).then(predictions => {
        console.log('Predictions: ', predictions);
        var objectClass = predictions[0].class;
        if(objectClass !== 'undefined') {
            result.innerHTML = predictions[0].class;
        }
    });
});
}

function stopStreamedVideo() {

    clearInterval(captureImage);
    nono = 'OFF';
    videoFrame();
    document.querySelector('#bye').play();

    const tracks = video.srcObject.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });
    video.srcObject = null;

};

function myTimer(){
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    imageRecognition();
    //console.log(canvas);
}

function playAudio(){
    document.querySelector('#hello').play();
}

function videoFrame(){
    const frame = document.getElementById('video-frame');
    const order = document.querySelector('.order');
    const prediction = document.querySelector('.prediction');

    if(nono === 'OFF'){
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
    console.log('DOM fully loaded and parsed. Nono is ready!');
    videoFrame();
    document.querySelector('#btn-start').addEventListener('click', startStreamVideo);
    document.querySelector('#btn-stop').addEventListener('click', stopStreamedVideo);
});
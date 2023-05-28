
// client-side js
// run by the browser each time your view template is loaded

console.log('hello world :o');


// define variables that reference elements on our page
const santaForm = document.forms[0];
// listen for the form to be submitted and add a new dream when it is
santaForm.onsubmit = function (event) {
  // TODO: check the text isn't more than 100chars before submitting
  const inputText = santaForm.elements['inputText'].value;
  const userid = santaForm.elements['userid'].value;
  if (inputText.length > 100) {
    event.preventDefault();
    alert('Oops! Input text should not exceed 100 characters.');
  }
  
  console.log("Form submitting !!!");
  

  
};
// add bgm to page
const sound = new Howl({
  src: ['https://cdn.glitch.global/e93fa779-7014-47de-9263-79efe4fea9aa/bgm.mp3?v=1685276165263'],
  autoplay: true,
  loop: true,
  volume: 0.5
});

// Play the sound initially
sound.play();

// Play the sound when the button is clicked
document.getElementById('play-button').addEventListener('click', function() {
  sound.play();
});

// Pause the sound when the button is clicked
document.getElementById('pause-button').addEventListener('click', function() {
  sound.pause();
});

// Change the volume when the slider is adjusted
document.getElementById('volume-slider').addEventListener('input', function() {
  const volume = parseFloat(this.value);
  sound.volume(volume);
});
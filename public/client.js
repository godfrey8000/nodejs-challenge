
// client-side js
// run by the browser each time your view template is loaded

console.log('hello world :o');


// define variables that reference elements on our page
const santaForm = document.forms[0];

// listen for the form to be submitted and add a new dream when it is
santaForm.onsubmit = function (event) {
  // TODO: check the text isn't more than 100chars before submitting
  const inputText = santaForm.elements['inputText'].value;
  
  if (inputText.length > 100) {
    event.preventDefault();
    alert('Oops! Input text should not exceed 100 characters.');
  }
  
  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputText })
  })
  .then(response => {
    
    if (response.ok) {
      console.log('Form submitted successfully');
      // Perform any desired action on successful form submission
    } else {
      console.error('Form submission failed');
    }
  })
  .catch(error => {
    console.error('Error on submiting form:', error);
  });
  
};



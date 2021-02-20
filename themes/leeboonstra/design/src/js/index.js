require('../sass/main.scss')

const buttons = document.querySelectorAll('.youtubeLink');
buttons.forEach(function(button){
	button.addEventListener('click', event => {
		console.log(event.target.children[0]);
		var id = event.target.children[0].innerHTML;
		var url = 'https://www.youtube.com/embed/' + id;

		document.getElementById('youtubeFrame').setAttribute('src', url)
	});
});

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
	  navigator.serviceWorker.register('/serviceworker.js').then(registration => {
		console.log('My SW registered: ', registration);
	  }).catch(registrationError => {
		console.log('My SW registration failed: ', registrationError);
	  });
	});
  }
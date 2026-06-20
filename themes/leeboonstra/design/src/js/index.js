
// YouTube functionality
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.youtubeLink');
    buttons.forEach(function(button){
        button.addEventListener('click', event => {
            event.preventDefault();
            const idElement = button.querySelector('.youtubeId');
            if (idElement) {
                var id = idElement.innerHTML.trim();
                var url = 'https://www.youtube.com/embed/' + id;
                document.getElementById('youtubeFrame').setAttribute('src', url);
            }
        });
    });
});


// Service worker registration temporarily disabled for debugging
// if ('serviceWorker' in navigator) {
// 	window.addEventListener('load', () => {
// 	  navigator.serviceWorker.register('/serviceworker.js').then(registration => {
// 		console.log('My SW registered: ', registration);
// 	  }).catch(registrationError => {
// 		console.log('My SW registration failed: ', registrationError);
// 	  });
// 	});
// }
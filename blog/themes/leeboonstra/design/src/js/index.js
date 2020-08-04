/* Main JS File */ 


/**
 * Load de main SASS file
 * You can also customize the bootstrap sass import there
 */
require('../sass/main.scss')

/**
 * Load jQuery and Bootstrap plugin
 * This is optinal, so you can remove or comment the code below.
 */
try {
	window.$ = window.jQuery = require('jquery')
	require('bootstrap/dist/js/bootstrap.bundle')
} catch (e) {}

/**
 * Now you'll be ready to develop your application
 * using bootstrap core files.
 */

/* Play Videos */
$( ".youtubeLink" ).click(function() {
	var id = $(this).find( ".youtubeId").html();
	var url = 'https://www.youtube.com/embed/' + id;
	$('#youtubeFrame').attr("src", url);
});
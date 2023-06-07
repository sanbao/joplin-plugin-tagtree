document.addEventListener('click', event => {
	const element = event.target;
	if (element.id === 'startTimer') {
		// Post the message and slug info back to the plugin:
		webviewApi.postMessage({
			command: 'start_timer',
		});
	}
	if (element.id === 'stopTimer') {
		// Post the message and slug info back to the plugin:
		webviewApi.postMessage({
			command: 'stop_timer',
		});
	}
});

function showdetail(tagid,that){
	var detail = $(that).attr('class')
	console.log(detail)
	if('fas fa-folder-open' === detail){
		// $(that).text('++')
		$(that).attr('class','fas fa-folder')
		$('#taglist'+tagid).hide()
	}else if('fas fa-folder' === detail){
		// $(that).text('----')
		$(that).attr('class','fas fa-folder-open')
		$('#taglist'+tagid).show()
	}
}
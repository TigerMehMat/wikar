function jsonRequest($){ console.log($);
	$.ajax({
		url: "error",
		dataType: "json",
		success: function(){ alert("Всё норм, данные получены!"); },
		error: function(){
			let question = confirm("Вы смирились с неудачей?");
			if(question) return;
			jsonRequest($);
		},
	});
}

jsonRequest(jQuery);
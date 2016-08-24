(function(){
	/* how to guide 
	 http://www.html5canvastutorials.com/tutorials/html5-canvas-bezier-curves/
	*/
	var body = document.body;
	var html = document.documentElement;
	var pageHeight = Math.max( body.scrollHeight, 
							body.offsetHeight, 
							html.clientHeight, 
							html.scrollHeight,
							html.offsetHeight );
	
	var allJoinLines = document.getElementsByClassName('joiningLine');

	
	var exagerate = 1 // how 'bendy' is the line
	var shapeStyles = {
		lineThickness: 1,
		lineColor: '#000',
		endcaps: 'round'
	}


	function drawLine(){
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var scrollPosition = window.scrollY

		for(let i=0; i<allJoinLines.length; i++){
			var firstLine = document.getElementById(`joiningLine${i}`); // canvas id
			var movingBox = document.querySelector(`#section${i} h1`);
			var stillBox = document.getElementById(`sectionLabel${i}`);

			var stillBoxPosition = stillBox.offsetTop + (stillBox.clientHeight/2)
			var movingBoxPosition = movingBox.offsetTop + 15;
			var movingBoxPositionLeft = movingBox.offsetLeft;

			var endPositonTop = movingBoxPosition - scrollPosition + 50;

			var bezWidth = function(){
				var val = windowWidth * ( (movingBoxPosition - scrollPosition - stillBoxPosition) / movingBoxPosition)
				return Math.sqrt(val*val) * exagerate	
			} 

			firstLine.width = windowWidth 
			firstLine.height = windowHeight

			var ctx = firstLine.getContext("2d");
				ctx.beginPath();
				ctx.moveTo(stillBox.clientWidth, stillBoxPosition); // start point
				ctx.bezierCurveTo(
					350, stillBoxPosition, // first bezier control
					200, endPositonTop, // second bezier control
					movingBoxPositionLeft, endPositonTop // end point
					);

				//ctx.closePath();
				ctx.lineWidth = shapeStyles.lineThickness;
				ctx.strokeStyle = shapeStyles.lineColor;
				ctx.lineCap = shapeStyles.endcaps;
				//ctx.fillStyle = shapeStyles.fillColor;
				//ctx.fill();
				ctx.stroke(); // draw stroke

		}

		
	}
	


	window.onresize = drawLine
	window.onscroll = drawLine




})()
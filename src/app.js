

	const container = document.getElementById('appContainer');
	const parCount = 3;
	var state={
		lines: [
			{
				id: 'line1'
			},
			{
				id: 'line2'
			},
			{
				id: 'line3'
			}
		]
	}

	function articleSectionTemplate(sectionId){
		return `
			<section id="section${sectionId}">
				<h1>section ${sectionId} headline</h1>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae assumenda sit blanditiis, delectus dolorum nisi rerum aperiam tempore tenetur totam ullam illo laborum culpa, quibusdam ad cum, recusandae maiores deserunt.</p>
				<p>Adipisci provident voluptatum consectetur eveniet iure quaerat nostrum ratione aliquid officiis repellat facilis rem vel, ipsam qui maxime voluptatibus iusto amet incidunt, saepe et. Perspiciatis ratione, distinctio ducimus sed architecto.</p>
				<p>Fugiat rem velit, placeat ipsam itaque! Aspernatur error commodi quam qui mollitia odit tempora eum, nostrum repudiandae dolore dolorum quae incidunt a repellendus eveniet ratione adipisci cupiditate sunt, reprehenderit dolorem!</p>
				<p>Mollitia labore quidem libero numquam ipsum rerum id eum sit voluptas accusantium amet sapiente accusamus, itaque nemo reprehenderit praesentium? Eos facere accusantium quidem alias corporis distinctio accusamus impedit beatae totam!</p>
				<p>Iste omnis sapiente reiciendis perferendis tenetur in voluptas voluptates quam laborum autem illo magni quo nostrum labore sint, odio quas vitae sequi, eveniet minima quisquam aspernatur deleniti voluptatem? Ea, veniam.</p>
				<p>Consequatur facilis eligendi, tenetur quibusdam mollitia totam, veritatis, magni fuga accusantium porro et aspernatur, illo similique ipsa atque laborum dolorum fugit odit! Beatae tempore, labore quam quos porro harum esse.</p>
				<p>Quae esse, aperiam dicta optio laborum doloremque eligendi accusamus soluta adipisci consequatur neque sed, hic quaerat, animi ad iste nobis dolor excepturi. Fugiat reiciendis iste beatae, ex quos cupiditate est?</p>
				<p>Quos id explicabo, quo perspiciatis magnam consectetur eveniet dolor blanditiis, tenetur omnis asperiores, vel corporis alias ratione totam non odio. Unde ducimus rem, ullam sit modi nobis soluta, vero cupiditate.</p>
				<p>Doloremque dolore quisquam quo maiores, ex nesciunt vero, quod ab fugit, repudiandae neque. Rerum odit architecto natus, nostrum vel iusto recusandae maxime? Laudantium dolorem doloribus animi ratione sint, iste commodi?</p>
				<p>Non sit quis fuga impedit nemo facere, quisquam voluptatem sed accusamus repellat! Doloremque ipsa, quibusdam? Voluptatum placeat corporis nostrum mollitia, rerum natus id aliquid numquam, dolorem dolores laboriosam nisi facilis!</p>
			</section>
		`
	}

	function mapTemplate(){
		return `
			<div class="svgHolder">
				<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1280 1000" style="enable-background:new 0 0 1280 800;" xml:space="preserve">
					<style type="text/css">
						.st0{fill:none;}
					</style>
					<g class="all">
						<path id="line1" class="st0" fill="transparent" stroke="#f00" stroke-width="4" stroke-miterlimit="10" d="M54.7,14.9c-5.2,5.7-14.9,9.8-10.3,20.1s13.9,14.4,10.3,19.6S32,76.3,29.9,92.2c-0.7,5.1,0,14.1,1.4,24.3"/>
						<path id="line2" class="st0" fill="transparent" stroke="#0f0" stroke-width="4" stroke-miterlimit="10" d="M31.4,116.6c2.9,21.6,8.8,48.9,11.4,58.7c3.7,14.4,7.3,34,3.7,41.2s-24.7,59.8-24.7,74.7s0,40.2,0,40.2s0,13.4,3.1,17s8,4.1,13.8,11.3s9.4,3.6,2.7,15.5s-19.6,21.6-8.8,39.7"/>
						<path id="line3" class="st0" fill="transparent" stroke="#00f" stroke-width="4" stroke-miterlimit="10" d="M32.5,414.9c10.8,18,21.7,35.1,23,47.9s3.8,23.7,2.3,35.6s-18.6,30.4-13.9,39.7c4.6,9.3,10.8,28.4,9.3,33C51.6,575.8,50,585,50,585"/>
					</g>
				</svg>
			</div>
		`
	}






	function pageTemplate(){
		var content = [
			mapTemplate()
		];
		for(let i=0; i<parCount; i++){
			content.push(articleSectionTemplate(i+1))
		}
		let bigBox = window.innerHeight * 2
		content.push(`<div style="height:${bigBox}px; width: 100%; background:lightgrey">spacer</div>`)
		return content.join('')	
	}




	

	function sectionPosition(elem){
		return document.querySelector(elem).offsetTop - document.body.scrollTop
	}

	



	function findHeights(){
		state.window = {
			height: window.innerHeight
		}
		state.pageHeight = document.body.clientHeight
		state.contentHeight = appContainer.clientHeight
	}


	function findPositions(){
		state.currentPos = document.body.scrollTop;
		for (let i=0; i<parCount; i++){
			let section = `section${i+1}`
			let elem = document.getElementById(section)
			state[section] = {
				'heightPc': (elem.clientHeight / state.contentHeight) * 100,
				'offset': elem.offsetTop - state.window.height
			}
			
			if (i===0){
				var startNext = document.getElementById(`section${i+2}`).offsetTop;
				var startThis = document.getElementById(`section${i+1}`).offsetTop;
				// first - section1
				state.firstSection = section
				state.lines[i].startPct = ( (startThis) / state.pageHeight ) * 100
				state.lines[i].endPct = ( (startNext) / state.pageHeight ) * 100
				//return
			} else if((i+1)===parCount){
				var startThis = document.getElementById(`section${i+1}`).offsetTop;
				// last - section3
				state.lastSection = section
				state.lines[i].startPct = ( (startThis) / state.pageHeight) * 100
				state.lines[i].endPct = ((startThis + document.getElementById(section).clientHeight) / state.pageHeight) * 100 //100
				//return 
			} else {
				var startThis = document.getElementById(`section${i+1}`).offsetTop
				var startNext = document.getElementById(`section${i+2}`).offsetTop;
				// middle - section2
				state.lines[i].startPct = ((startThis) / state.pageHeight) * 100
				state.lines[i].endPct = ( (startNext) / state.pageHeight) * 100
				//return
			}
		};
		let lastSection = document.getElementById(state.lastSection)
		state.scrollPercent = ( (state.currentPos) / (state.pageHeight - lastSection.clientHeight - window.innerHeight ) ) * 100
		state.windowPercent = ( document.body.scrollTop / (document.body.clientHeight - window.innerHeight) ) * 100
		console.log('window percent:', state.windowPercent)
	}





	function renderPage(content, into){
		into.innerHTML = content;
		findHeights();
		findPositions()
	}
	renderPage( pageTemplate(), appContainer )






	function calcPathLength(elem){
		if (elem.getTotalLength){
			// It's a path
			return elem.getTotalLength();
		} else if (elem.tagName === "rect"){
			// Handle rect elements: perimeter length = w + w + h + h
			return (elem.width.baseVal.value + elem.height.baseVal.value) * 2;
		} else if (elem.tagName === "circle"){
			// Handle circle elements: perimeter length = 2 * r * PI
			return elem.r.baseVal.value * 2 * Math.PI;
		} else if (elem.tagName === "line"){
			// Handle line elements: use pythagoras' theorem
			var dx = elem.x2.baseVal.value - elem.x1.baseVal.value;
			var dy = elem.y2.baseVal.value - elem.y1.baseVal.value;
			return Math.sqrt(dx * dx + dy * dy);
		}
	// If you use other elem types, you will have to add support for them here.
	}


	function scrollEventHandler(){
		// Calculate how far down the page the user is 
		var percentOfScroll = (( document.body.scrollTop / (document.body.clientHeight ) ) ) * 100
		console.log(percentOfScroll)

		// For each element that is getting drawn...
		for (var i=0; i<state.lines.length; i++){
			var data = state.lines[i];
			var elem = document.getElementById(data.id);

			// Get the length of this elements path
			var dashLen = calcPathLength(elem);

			// Calculate where the current scroll position falls relative to our path
			var fractionThroughThisElem = (percentOfScroll - data.startPct) / (data.endPct - data.startPct);
			// Clamp the fraction value to within this path (0 .. 1)
			fractionThroughThisElem = Math.max(fractionThroughThisElem, 0);
			fractionThroughThisElem = Math.min(fractionThroughThisElem, 1);

			var dashOffset = dashLen * (1 - fractionThroughThisElem);

			elem.setAttribute("stroke-dasharray", dashLen);
			elem.setAttribute("stroke-dashoffset", dashOffset);
		}//end for loop
	}



	findPositions();
	scrollEventHandler();
	console.log(state)
	
	window.onscroll = ()=>{
		scrollEventHandler();	
	}
	

window.addEventListener("scroll", function () {
    scrollEventHandler();	
}, false);






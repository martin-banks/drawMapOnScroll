(()=>{

	const container = document.getElementById('appContainer');
	const parCount = state.chapters.length;

	function articleSectionTemplate(chapters){
		return `${ chapters.map((chapter,index)=>{
				return `
					<section id="section${index}">
						<img id="img${index}" class="displayImage" src="${state.imagePath}${chapter.article.image}" alt="">
						<h1>${chapter.article.headline}</h1>
						${chapter.article.text.map((par, i)=>{
							return `<p>${par}</p>`
						}).join('')}	
					</section>
				`
				}).join('')
			}`
		
	}


	function linesTemplate(){
		return state.chapters.map((line, index)=>{
			return `
				<path id="${line.id}" ${state.svgStyle} stroke="${line.strokeColor}" d="${line.data}"/>
			`
		}).join('')	
	}

	function sidebarLabelTemplate(lines){
		console.log(lines.length)
		return lines.map((line, index)=>{
			return `
				<a id="sectionLabel${index}" href="#section${index}"><h4 class="sidebarLabel">${line.sidebarLabel}</h4></a>
				${index === (lines.length-1) ? sidebarExtraLabelTemplate(state.endLabel, index+1) : '' }
			`
		}).join('')
	}

	function sidebarExtraLabelTemplate(label, index){
		return `<a id="sectionLabel${index}" href="#section${index}"><h4 class="sidebarLabel">${label}</h4></a>`
	}

	
	function mapTemplate(){
		return `
			<div id="svgHolder" class="svgHolder svgHolderStartPosition">
				<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<g class="all">
						${linesTemplate()}
					</g>
				</svg>
				<div id="labelContainer">
					${sidebarLabelTemplate(state.chapters)}
				</div>
				
			</div>
		`
	}






	function pageTemplate(){
		let bigBox = window.innerHeight * 2
		/*var content = [
			mapTemplate()
		];
		content.push(articleSectionTemplate(state.chapters));
		content.push(`<section id="section${parCount}"></section><div style="height:${bigBox}px; width: 100%; background:rgba(0,0,0,0.05)">spacer</div>`)
		return content.join('')	*/

		return `
			${mapTemplate()}
			<article>
				${articleSectionTemplate(state.chapters)}
			</article>
			<section id="section${parCount}">
				<div style="height:${bigBox}px; width: 100%; background:rgba(0,0,0,0.05)">
					spacer
				</div>
			</section>
			
			
		`
	}



	


	function findHeights(){
		state.contentHeight = ()=>{
			let totalHeight = 0
			for(let i=0; i<parCount; i++){
				totalHeight += document.getElementById(`section${i}`).clientHeight
			}
			return totalHeight
		}
		state.window = {
			height: window.innerHeight
		}
		state.pageHeight = document.body.clientHeight
		state.contentHeight = appContainer.clientHeight
	}


	function findPositions(){
		state.currentPos = document.body.scrollTop;
		for (let i=0; i<=parCount; i++){
			if(i<parCount){
				let section = `section${i}`
				let elem = document.getElementById(section)
				state[section] = {
					'heightPc': (elem.clientHeight / state.contentHeight) * 100,
					'offset': elem.offsetTop - state.window.height
				}

				let startThis = document.getElementById(section).offsetTop
				console.log(state.pageHeight)
				
				state.chapters[i].startPct = (startThis / state.pageHeight) * 100
				console.log('start ', section, state.chapters[i].startPct)
				
				state.chapters[i].endPct = ( (startThis + elem.clientHeight) / state.pageHeight ) * 100 
				console.log('end ', section, state.chapters[i].endPct, '\n---')
				
				if (i===0){
					// first - section1
					state.firstSection = section
				} else if((i+1)===parCount){
					// last - section3
					state.lastSection = section
				} else {
					// middle sections
				}
				
			} else if (i===parCount) {
				//document.querySelector(`#labelContainer a:nth-of-type(${i+1})`).style.top = `95%`

			}

			
		}
		let lastSection = document.getElementById(state.lastSection)
			state.scrollPercent = ( (state.currentPos) / (state.pageHeight - lastSection.clientHeight - window.innerHeight ) ) * 100
			state.windowPercent = ( document.body.scrollTop / (document.body.clientHeight - window.innerHeight) ) * 100
			console.log('window percent:', state.windowPercent)	
	}





	function renderPage(content, into){
		into.innerHTML = content;
		findHeights();
		findPositions();
	}
	renderPage( pageTemplate(), appContainer )



	function setProgressLabels() {
		let currentPositon = document.body.scrollTop 
		let progressPercent = (currentPositon / state.contentHeight) * 100;
		var sidebarLabels = document.getElementsByClassName('sidebarLabel');

		if (progressPercent >= 0){
			sidebarLabels[0].style.color = 'green'
		}
		for(let i=1; i <= state.chapters.length; i++){
			if ((i===state.chapters.length) && (progressPercent === state.chapters[state.chapters.length-1].endPct)){
				sidebarLabels[i].style.color = 'green'
			} else if (progressPercent >= state.chapters[i-1].endPct){
				sidebarLabels[i].style.color = 'green'
			} else {
				sidebarLabels[i].style.color = ''
			}
		} 

	}



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

	// transition map from display to side bar
	function moveMap(percentOfScroll){
		//var percentOfScroll = (( document.body.scrollTop / (document.body.clientHeight ) ) ) * 100
		if(percentOfScroll >= 3){
			document.getElementById('svgHolder').className = 'svgHolder'
		} else {
			document.getElementById('svgHolder').className = 'svgHolder svgHolderStartPosition'
		}
	}

	function positionLabels(){
		var labelPos = 0
		for (var i=0; i<=state.chapters.length; i++){
			if(i<state.chapters.length){
				var data = state.chapters[i];
				var elem = document.getElementById(data.id);
				var rect = elem.getBoundingClientRect().height
				var dashLen = calcPathLength(elem);
				console.log('heights', i, rect)
				
				document.querySelector(`#labelContainer a#sectionLabel${i}`).style.top = `${labelPos}px`
			} else {
				document.querySelector(`#labelContainer a#sectionLabel${i}`).style.top = `${labelPos}px`
			}
			labelPos += rect
		}
	}

	function scrollEventHandler(){
		// Calculate how far down the page the user is 
		var percentOfScroll = (( document.body.scrollTop / (document.body.clientHeight ) ) ) * 100
		console.log('percent of scroll:', percentOfScroll)
		moveMap(percentOfScroll)
		// For each element that is getting drawn...
		for (var i=0; i<state.chapters.length; i++){
			var data = state.chapters[i];
			var elem = document.getElementById(data.id);

			// Get the length of this elements path
			var dashLen = calcPathLength(elem);
			//console.log('dashLen', i, dashLen)

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
	setProgressLabels()
	positionLabels()
	

	window.addEventListener("scroll", function () {
		scrollEventHandler();
		setProgressLabels()
	}, false);





})()


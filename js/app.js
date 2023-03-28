window.onload = function () {
	//_smooth_scrolling()
	//_line()
	_header_scroll()
	_icon_menu()
	_smoothscroll()
	//========================================================================================================================================================
	const blob = document.getElementById("blob");
	let clientX;
	let clientY;

	window.onpointermove = event => { 
		clientX = event.clientX;
		clientY = event.clientY;
		blob.animate({
			left: `${clientX}px`,
			top: `${clientY + window.pageYOffset}px`
		}, { duration: 3000, fill: "forwards" });
	}
	//========================================================================================================================================================

	let progressbar = document.querySelector('.progressbar');
	let height = document.body.scrollHeight - window.innerHeight;

	window.onscroll = function() {
		let progressheight = (window.pageYOffset / height) * 100;
		progressbar.style.height = progressheight + "%";
		
		blob.animate({
			left: `${clientX}px`,
			top: `${clientY + window.pageYOffset}px`
		}, { duration: 300, fill: "forwards" });
	}
	
	//========================================================================================================================================================
	

	const observer  = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if(entry.isIntersecting){
				entry.target.classList.add('show')
				if(entry.target.classList.contains('join-rightContent__video')){
					document.querySelector('#video1').play();
					document.querySelector('#video2').play();
				}
			}
		})
	})

	const elements = document.querySelectorAll('.animation-on-scroll')
	elements.forEach((element) => observer.observe(element))

	document.querySelector('spline-viewer').shadowRoot.querySelector('#logo').style.cssText = 
	`
	opacity: 0;
	visibility: hidden;
	`

	const pos = document.documentElement
	pos.addEventListener("mousemove", e => {
		pos.style.setProperty('--x', e.clientX+'px');
	})

	//========================================================================================================================================================
	document.querySelectorAll('.gallery__item').forEach(element => {
		element.addEventListener("mouseover", function (params) {
			element.classList.add("_active");
		})
		element.addEventListener("mouseleave", function (params) {
			element.classList.remove("_active");
		})
	});;

	//========================================================================================================================================================
	
	let calculateAngle = function(e, item, parent) {
		let dropShadowColor = `rgba(0, 0, 0, 0.3)`
		if(parent.getAttribute('data-filter-color') !== null) {
				dropShadowColor = parent.getAttribute('data-filter-color');
		}

		parent.classList.add('animated');
		// Get the x position of the users mouse, relative to the button itself
		let x = Math.abs(item.getBoundingClientRect().x - e.clientX);
		// Get the y position relative to the button
		let y = Math.abs(item.getBoundingClientRect().y - e.clientY);

		// Calculate half the width and height
		let halfWidth  = item.getBoundingClientRect().width / 2;
		let halfHeight = item.getBoundingClientRect().height / 2;

		// Use this to create an angle. I have divided by 6 and 4 respectively so the effect looks good.
		// Changing these numbers will change the depth of the effect.
		let calcAngleX = (x - halfWidth) / 6;
		let calcAngleY = (y - halfHeight) / 14;
	
		let gX = (1 - (x / (halfWidth * 2))) * 100;
		let gY = (1 - (y / (halfHeight * 2))) * 100;
	
		item.querySelector('.glare').style.background = `radial-gradient(circle at ${gX}% ${gY}%, rgba(199, 198, 243, 0.2), transparent)`;
		// And set its container's perspective.
		parent.style.perspective = `${halfWidth * 6}px`
		item.style.perspective = `${halfWidth * 6}px`

		// Set the items transform CSS property
		item.style.transform = `rotateY(${calcAngleX/(halfWidth / 90)}deg) rotateX(${-calcAngleY/1}deg) scale(1.0)`;

		// Reapply this to the shadow, with different dividers
		let calcShadowX = (x - halfWidth) / 3;
		let calcShadowY = (y - halfHeight) / 6;
		
		// Add a filter shadow - this is more performant to animate than a regular box shadow.
		item.style.filter = `drop-shadow(${-calcShadowX/(halfWidth / 90)}px ${-calcShadowY/1}px 15px ${dropShadowColor})`;
}

document.querySelectorAll('.card').forEach(function(item) {
		if(item.querySelector('.flip') !== null) {
			item.querySelector('.flip').addEventListener('click', function() {
				item.classList.add('flipped');
			});
		}
		if(item.querySelector('.unflip') !== null) {
			item.querySelector('.unflip').addEventListener('click', function() {
				item.classList.remove('flipped');
			});
		}
		item.addEventListener('mouseenter', function(e) {
				calculateAngle(e, this.querySelector('.inner-card'), this);
		});

		item.addEventListener('mousemove', function(e) {
				calculateAngle(e, this.querySelector('.inner-card'), this);
		});

		item.addEventListener('mouseleave', function(e) {
				let dropShadowColor = `rgba(0, 0, 0, 0.3)`
				if(item.getAttribute('data-filter-color') !== null) {
						dropShadowColor = item.getAttribute('data-filter-color')
				}
				item.classList.remove('animated');
				item.querySelector('.inner-card').style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
				item.querySelector('.inner-card').style.filter = `drop-shadow(0 10px 15px ${dropShadowColor})`;
		});
})
	
_counter()
}

function _counter() {
	var counters = document.querySelectorAll("._counter");

	function animate({timing, draw, duration}) {

		let start = performance.now();
	
		requestAnimationFrame(function animate(time) {
			let timeFraction = (time - start) / duration;
			if (timeFraction > 1) timeFraction = 1;
	
			let progress = timing(timeFraction)
	
			draw(progress); 
	
			if (timeFraction < 1) {
				requestAnimationFrame(animate);
			}
	
		});
	}
	function makeEaseOut(timing) {
		return function(timeFraction) {
			return 1 - timing(1 - timeFraction);
		}
	}
	function circ(timeFraction) {
		return 1 - Math.sin(Math.acos(timeFraction));
	}
	let bounceEaseInOut = makeEaseOut(circ);

  var config = {"attributes": true};
	var observer = new MutationObserver(mutationEvent);
	
	function mutationEvent(mutationsList) {
			for(var mutation of mutationsList) if (mutation.type == 'attributes') {
				if(mutation.target.classList.contains('show') == true && 
				mutation.target.classList.contains('disable') == false){
					
					mutation.target.classList.add('disable')

					let value = mutation.target.getAttribute("data-count");
					let text = mutation.target.getAttribute("data-text");
					let time = mutation.target.getAttribute("data-time");

					let target = mutation.target
					function anim() {
						animate({
							duration: time,
							timing: bounceEaseInOut,
							draw: function(progress) {
								target.innerHTML = `${Math.floor(progress * value)}${text}`;
							}
						});
					};
					anim()
				}
			}
	};
	
	counters.forEach(element => {
		observer.observe(element, config);
	});
}
function _header_scroll() {
	const header = document.querySelector('header')

	const callback = function (entries, observer) {
		if (entries[0].isIntersecting) {
			header.classList.remove('_scroll')
		} else {
			header.classList.add('_scroll')
		}
	}
	const headerObs = new IntersectionObserver(callback)
	headerObs.observe(header)
}

function _icon_menu() {
	let iconMenu = document.querySelector('.icon-menu')
	let menuBodyArray = document.querySelectorAll('.menu__body ul li')
	if (iconMenu != null) {
		let logo = document.querySelector('.header__logo')
		let menuBody = document.querySelector('.menu__body')
		iconMenu.addEventListener('click', function (e) {
			iconMenu.classList.toggle('_active')
			menuBody.classList.toggle('_active')
		})
		menuBodyArray.forEach(element => {
			element.addEventListener('click', function (e) {
				iconMenu.classList.remove('_active')
				menuBody.classList.remove('_active')
			})
		})
		logo.addEventListener('click', function (e) {
			iconMenu.classList.remove('_active')
			menuBody.classList.remove('_active')
		})
	}
}

/*
<script src="https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.10/SmoothScroll.min.js" integrity="sha256-huW7yWl7tNfP7lGk46XE+Sp0nCotjzYodhVKlwaNeco=" crossorigin="anonymous"></script>
*/
function _smoothscroll() {
	SmoothScroll({
		// Время скролла 400 = 0.4 секунды
		animationTime : 800,
		// Размер шага в пикселях
		stepSize : 75,
		
		// Дополнительные настройки:
		
		// Ускорение
		accelerationDelta : 30,
		// Максимальное ускорение
		accelerationMax : 2,
		
		// Поддержка клавиатуры
		keyboardSupport : true,
		// Шаг скролла стрелками на клавиатуре в пикселях
		arrowScroll : 50,
		
		// Pulse (less tweakable)
		// ratio of "tail" to "acceleration"
		pulseAlgorithm : true,
		pulseScale : 4,
		pulseNormalize : 1,
		
		// Поддержка тачпада
		touchpadSupport : true,
		})
}
//для подключения необходимо прописать инклюд в этом файле и вызвать функцию в script.js
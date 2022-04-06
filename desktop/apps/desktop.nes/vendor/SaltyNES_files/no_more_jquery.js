// Copyright (c) 2016 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// This software uses a MIT style license
// https://github.com/SoftwareAddictionShow/no-more-jquery
"use strict";

// Great website for reasons not to use jquery:
// http://youmightnotneedjquery.com

let style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.hidden { display: none !important; }';
document.getElementsByTagName('head')[0].appendChild(style);

function $(selector) {
	if(! selector || selector.length === 0) {
		return null;
	} else if (selector[0] === '#') {
		return document.querySelector(selector);
	} else if(selector[0] === '.') {
		return document.querySelectorAll(selector);
	} else {
		return document.getElementsByTagName(selector);
	}

	return null;
}

function hide(selector) {
	let elements = document.querySelectorAll(selector);
	for (let i=0; i<elements.length; ++i) {
		elements[i].classList.add('hidden');
	}
}

function show(selector) {
	let elements = document.querySelectorAll(selector);
	for (let i=0; i<elements.length; ++i) {
		elements[i].classList.remove('hidden');
	}
}

function is_hidden(selector) {
	let element = document.querySelector(selector);
	if (element) {
		return element.classList.contains('hidden');
	}

	return false;
}

function documentOnReady(cb) {
	if (document.readyState !== 'loading') {
		cb();
	} else {
		document.addEventListener('DOMContentLoaded', cb);
	}
}

function httpGet(url, cb, timeout) {
	httpRequest(url, 'GET', cb, timeout);
}

function httpPost(url, cb, timeout) {
	httpRequest(url, 'POST', cb, timeout);
}

function httpRequest(url, method, cb, timeout) {
	timeout = timeout || 3000;
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4) {
			cb(this.response, this.status);
		} else if (this.readyState === 0) {
			cb(null);
		}
	};
	xhr.onerror = function() {
		cb(null);
	};
	xhr.open(method, url, true);
	xhr.timeout = timeout;
	xhr.send(null);
}

// FIXME: This stacks a new set of events for each animation call
// FIXME: Use a unique random number, rather than this global
let g_anim_counter = 0;
function animateCSS(element, start_fields, end_fields, duration, iteration_count, direction) {
	iteration_count = iteration_count || 1;
	direction = direction || 'normal';
	let anim_name = 'anim_' + (++g_anim_counter);

	let style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `
	.${anim_name} {
		animation-duration: ${duration};
		animation-name: ${anim_name};
		animation-iteration-count: ${iteration_count};
		animation-direction: ${direction};
	}
	@keyframes ${anim_name} {
		from {
			${start_fields}
		}
	}
	@keyframes ${anim_name} {
		to {
			${end_fields}
		}
	}`;
	document.getElementsByTagName('head')[0].appendChild(style);

	element.addEventListener('animationstart', function() {
		console.info('animationstart');
	}, false);
	element.addEventListener('animationend', function() {
		console.info('animationend');
		document.getElementsByTagName('head')[0].removeChild(style);
	}, false);
	element.addEventListener('animationiteration', function() {
		console.info('animationiteration');
	}, false);
	element.className = anim_name;
}

function animateValue(cb, old_value, new_value, target_time) {
	let is_bigger = old_value > new_value;
	let diff_value = is_bigger ? old_value - new_value : new_value - old_value;
	let start_time = null;

	let stepTime = function(timestamp) {
		if (start_time === null) {
			start_time = timestamp;
		}
		let elapsed_time = timestamp - start_time;
		let percent = elapsed_time / target_time;
		if (percent >= 1.0) {
			percent = 1.0;
		}

		let trans_value = 0;
		if (is_bigger) {
			trans_value = old_value - (diff_value * percent);
		} else {
			trans_value= old_value + (diff_value * percent);
		}
		cb(trans_value);
		if (percent !== 1.0) {
			window.requestAnimationFrame(stepTime);
		}
	};
	window.requestAnimationFrame(stepTime);
}

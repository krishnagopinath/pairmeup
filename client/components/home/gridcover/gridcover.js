import angular from 'angular';

import template from './gridcover.tmpl.html';
import './gridcover.css';

import {boxColors, boxHeight, boxWidth} from './gridcover.constants.js';

class GridCoverController {
	constructor($window, $interval) {
		'ngInject';

		this.$window = $window;
		this.$interval = $interval;

		this.makeItBlink = () => this._makeItBlink();
	}

	$onInit() {
		const {innerWidth, innerHeight} = this.$window;		
		const numberOfBoxes = Math.floor(((innerWidth)/boxWidth) * ((innerHeight)/boxHeight));

		this.boxes = Array(numberOfBoxes).fill({ class: null });
		
		//this.blinky = this.$interval(this.makeItBlink, 1000);
	}

	$onDestroy() {
		//this.$interval.cancel(this.blinky);
	}

	// SO wasteful. TODO remove && use <canvas/>
	_makeItBlink() {
		// pick a box
		const number = Math.floor(Math.random() * this.boxes.length);
		// pick a color
		const color = boxColors[Math.floor(Math.random() * boxColors.length)];

		// make the box blink!
		this.boxes[number].class = `animate-${color}`;
	}
}


const GridCoverModule = angular
							.module('gridcover', [])
							.component('gridcover', {
								template,
								controller: GridCoverController,
								controllerAs: 'vm'
							});

export default GridCoverModule;

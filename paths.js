'use strict';
import glob from 'glob';
module.exports = function(isProd) {

	const output = isProd ? 'dist' : 'tmp';

	return {
		output,
		outputGlob: output + `/**/*`,
		scripts: {
			src: [
				'./src/js/**/*.js',
				'!./src/js/global/**',
				'!./src/js/vendor/**',
				'!./src/js/controllers/**',
				'!./src/js/directives/**',
				'!./src/js/services/**',
				'!./src/js/filters/**'
			],
			glob: './src/js/**/*.js',
			dest: output + '/js',
			global: {
				filename: 'global.js',
				src: [
					'./src/js/global/**/*.js',
					'./src/js/controllers/**/*.js',
					'./src/js/directives/**/*.js',
					'./src/js/services/**/*.js',
					'./src/js/filters/**/*.js'
				],
				dest: './src/js'
			},
			vendor: {
				filename: 'vendor.js',
				src: [
					'./bower_components/angular/angular.js',
					'./bower_components/angular-route/angular-route.js',
					'./bower_components/angular-cookies/angular-cookies.js'
				],
				dest: './src/js'
			}
		},
		lint: {
			src: [
				'./js/**/*.js',
				'!./js/global.js'
			]
		},
		modernizr: {
			src: ['./js/**/*.js', '!./js/global.js', './scss/**/*.scss']
		},
		styles: {
			file: './src/scss/style.scss',
			src: ['./src/scss/**/*.scss'],
			dest: output + `/css`
		},
		views: {
			src: './src/views/**/*.html',
			dest: output + '/views'
		},
		fonts: {
			src: './font/**/*',
			dest: output + `/font`
		},
		iconFonts: {
			fontName: '[Enter Name]',
			src: './icons/font/**.svg',
			dest: output + `/icons/build`
		},
		images: {
			src: './img/**/*',
			dest: output + `/img`
		},
		gzip: {
			src: output +`/**/*.{svg,ttf,otf,eot,xml,css,js,js.map,css.map}`,
			dest: output
		},
		cleanup: {
			glob: ['./src/js/global.js', './src/js/vendor.js']
		},
		watch: output + `/**/*`,
		servePath: output
	};

};

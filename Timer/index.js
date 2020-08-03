const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');

const timer = new Timer(durationInput, startButton, pauseButton, {
	onStart() {
		console.log('started');
	},
	onTick() {
		console.log('ticked');
	},
	onComplete() {
		console.log('completed');
	}
});

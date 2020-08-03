class Timer {
	// durationInput, startButton and pauseButton is going to
	// reference a DOM element that is a input and buttons
	constructor(durationInput, startButton, pauseButton) {
		this.durationInput = durationInput;
		this.startButton = startButton;
		this.pauseButton = pauseButton;

		// As soon as setting class variables, an EventListener will be attached to `startButton`
		this.startButton.addEventListener('click', this.start);
		this.pauseButton.addEventListener('click', this.pause);
	}

	// starts timer
	start = () => {
		// to start tick function immediately, we invoke `tick` before `setInterval`
		this.tick();
		this.timerId = setInterval(() => {
			this.tick();
		}, 1000);
	};

	pause = () => {
		clearInterval(this.timerId);
	};

	tick = () => {
		this.durationInput.value = parseFloat(this.durationInput.value) - 1;
	};
}

const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');

const timer = new Timer(durationInput, startButton, pauseButton);

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
		if (!this.timerId) {
			// to start tick function immediately, we invoke `tick` before `setInterval`
			this.tick();
			this.timerId = setInterval(() => {
				this.tick();
			}, 1000);
		}
	};

	pause = () => {
		clearInterval(this.timerId);
		this.timerId = undefined;
	};

	tick = () => {
		if (this.timeRemaining <= 0) {
			this.pause();
		} else {
			// setter             getter
			this.timeRemaining = this.timeRemaining - 1;
		}
	};

	get timeRemaining() {
		return parseFloat(this.durationInput.value);
	}

	set timeRemaining(time) {
		this.durationInput.value = time;
	}
}

const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');

const timer = new Timer(durationInput, startButton, pauseButton);

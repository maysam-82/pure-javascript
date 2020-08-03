class Timer {
	// durationInput, startButton and pauseButton is going to
	// reference a DOM element that is a input and buttons
	constructor(durationInput, startButton, pauseButton, callbacks) {
		this.durationInput = durationInput;
		this.startButton = startButton;
		this.pauseButton = pauseButton;
		if (callbacks) {
			const { onStart, onTick, onComplete } = callbacks;
			this.onStart = onStart;
			this.onTick = onTick;
			this.onComplete = onComplete;
		}
		// As soon as setting class variables, an EventListener will be attached to `startButton`
		this.startButton.addEventListener('click', this.start);
		this.pauseButton.addEventListener('click', this.pause);
	}

	// starts timer
	start = () => {
		if (this.start) {
			this.onStart();
		}
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
			if (this.onComplete) {
				this.onComplete();
			}
		} else {
			// setter             getter
			this.timeRemaining = this.timeRemaining - 1;
			if (this.onTick) {
				this.onTick();
			}
		}
	};

	get timeRemaining() {
		return parseFloat(this.durationInput.value);
	}

	set timeRemaining(time) {
		this.durationInput.value = time;
	}
}

# Timer

Created a Timer with JavaScript class.

## Constructor Arguments

- `durationInput`: DOM element reference for `input` tag.
- `startButton`: DOM element reference for `button` tag which starts the timer.
- `pauseButton`: DOM element reference for `button` tag which pauses the timer.
- `callbacks`: There are three callbacks:
  
  - `onStart`: Which is invoked as soon as the timer starts.
  - `onTick`: Which is invoked as soon as the timer value decreases.
  - `onComplete`: Which is invoked as soon as the timer value reaches to 0.


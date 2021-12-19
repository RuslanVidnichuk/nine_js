import Notiflix from 'notiflix';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


const refs = {
    inputEl: document.querySelector('#datetime-picker'),
    startButton: document.querySelector('button[data-start]'),
    daysSpan: document.querySelector('span[data-days]'),
    hoursSpan: document.querySelector('span[data-hours]'),
    minutesSpan: document.querySelector('span[data-minutes]'),
    secondsSpan: document.querySelector('span[data-seconds]'),
    allValueSpan: document.querySelectorAll('.value'),
    allLabelSpan: document.querySelectorAll('.label'),
    timer: document.querySelector('.timer'),
    allTimerField: document.querySelectorAll('.field'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const chooseDate = new Date(selectedDates[0]);
      const unixDate = chooseDate.getTime();
      const defaultUnixDate = Date.now();

      if (unixDate <= defaultUnixDate) {
          Notiflix.Notify.failure('Please choose a date in the future');
      };

      if (unixDate > defaultUnixDate) {
          refs.startButton.removeAttribute('disabled');
        }

    console.log(selectedDates[0]);
  },
};

let electedDate = null;
const fp = flatpickr(refs.inputEl, options);
class Timer {
    constructor({ onTick }) {
        this.onTick = onTick;
    }

    start() {
        refs.startButton.setAttribute('disabled', '');
        refs.inputEl.setAttribute('disabled', '');
        const date = new Date(electedDate);
        const finishTime = date.getTime();

        const stopId = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = finishTime - currentTime;
            const time = this.convertMs(deltaTime);

            if (time.seconds < 0) {
                clearTimeout(stopId);
                
                refs.startButton.removeAttribute('disabled');
                refs.inputEl.removeAttribute('disabled');

                Notiflix.Notify.warning('Time is over!');

                return
            }

            this.onTick(time)
        }, 1000);
    }

    convertMs(ms) {
  // Number of milliseconds per unit of time
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        
  // Remaining days
        const days = this.addLeadingZero(Math.floor(ms / day));
  // Remaining hours
        const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
        const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
        const seconds = this.addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

        return { days, hours, minutes, seconds };
    }

    addLeadingZero(value) {
        return String(value).padStart(2, '0');
}
}

const timer = new Timer({
    onTick: updateClockface,
})
// const timer = {
//     start() {
//         refs.startButton.setAttribute('disabled', '');
//         refs.inputEl.setAttribute('disabled', '');
//         const date = new Date(electedDate);
//         const finishTime = date.getTime();

//         const stopId = setInterval(() => {
//             const currentTime = Date.now();
//             const deltaTime = finishTime - currentTime;
//             const { days, hours, minutes, seconds } = convertMs(deltaTime);

//             if (seconds < 0) {
//                 clearTimeout(stopId);
                
//                 refs.startButton.removeAttribute('disabled');
//                 refs.inputEl.removeAttribute('disabled');

//                 Notiflix.Notify.warning('Time is over!');

//                 return
//             }

//             updateClockface();
//         }, 1000);
//     },
// };

function updateClockface({ days, hours, minutes, seconds }) {
    refs.daysSpan.textContent = `${days}`;
    refs.hoursSpan.textContent = `${hours}`;
    refs.minutesSpan.textContent = `${minutes}`;
    refs.secondsSpan.textContent = `${seconds}`;

    console.log(`${days}:${hours}:${minutes}:${seconds}`)
}

refs.startButton.setAttribute('disabled', '');
refs.timer.style.display = 'flex';
refs.timer.style.marginLeft = '-10px';

for (let i = 0; i < refs.allValueSpan.length; i += 1) {
    refs.allValueSpan[i].style.fontSize = '50px';
    refs.allLabelSpan[i].style.fontSize = '20px';
    refs.allTimerField[i].style.display = 'flex'
    refs.allTimerField[i].style.flexDirection = 'column';
    refs.allTimerField[i].style.alignItems = 'center';
    refs.allTimerField[i].style.marginLeft = '10px'
}

refs.inputEl.addEventListener('input', event => {
    electedDate = event.target.value
});
refs.startButton.addEventListener('click', timer.start.bind(timer))
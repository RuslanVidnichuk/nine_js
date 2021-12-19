const refs = {
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
  body: document.querySelector('body')
};

let stopId = null;

refs.startBtn.addEventListener('click', onStartBtnClick);
refs.stopBtn.addEventListener('click', onStopBtnClick);

function onStartBtnClick() {
    refs.startBtn.setAttribute('disabled', '');
    stopId = setInterval(() => {
        const bodyBgColor = getRandomHexColor();
        refs.body.style.backgroundColor = bodyBgColor;
    }, 1000);
}

function onStopBtnClick() {
    clearTimeout(stopId);
    refs.startBtn.removeAttribute('disabled')
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

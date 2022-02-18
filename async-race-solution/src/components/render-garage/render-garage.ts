import {
  getCars,
} from '../../api';
import { startDriving, stopDriving } from '../start&stop driving/start-stop-driving';
import './render-garage.scss';

let CAR_CURRENT_PAGE = 1;

export const renderCarImage: (color: string, width?: number) => string = (color: string, width = 100) => `
  <?xml version="1.0" standalone="no"?>
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="${width}px" 
    height="27px" viewBox="0 0 981.000000 301.000000" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,301.000000) scale(0.100000,-0.100000)" fill="${color}" stroke="none">
      <path d="M3415 3004 c-11 -2 -81 -10 -155 -19 -563 -68 -1239 -225 -1705 -395 -656 -240
        -1111 -535 -1376 -892 l-61 -83 513 -5 c283 -3 522 -9 531 -13 54 -27 64 -112 19 -158 l-29 -29
        -571 0 -571 0 0 -70 c0 -80 22 -197 51 -277 l20 -53 325 0 c346 0 369 -3 394 -49 18 -35 12 -88
        -14 -118 l-24 -28 -279 -5 -278 -5 90 -90 c104 -105 181 -161 331 -245 l109 -60 271 0 
        272 0 4 223 c4 188 8 234 27 302 133 490 640 771 1154 641 171 -44 305 -121 432 -251 190 -194 
        270 -432 245 -731 -5 -66 -12 -134 -16 -151 l-6 -33 1752 0 1753 0 -7 31
        c-3 17 -6 85 -6 150 l0 119 -1526 0 c-1406 0 -1528 1 -1554 17 -30 17 -50 51
        -50 84 0 28 26 75 47 85 10 5 713 11 1561 14 l1544 5 22 70 c89 278 305 489
        591 578 337 105 714 23 936 -204 212 -215 280 -509 213 -912 l-7 -38 524 3
        524 3 71 48 c100 66 184 159 234 259 l41 83 -153 5 c-84 3 -161 9 -171 14 -23
        11 -47 58 -47 90 0 14 13 40 29 58 l29 33 172 3 173 3 -7 46 c-3 26 -17 70
        -30 100 l-25 53 -548 0 c-614 0 -594 -2 -661 74 -44 51 -44 101 0 151 67 77
        52 75 560 75 l453 1 -40 36 c-68 60 -176 133 -266 178 -580 293 -1455 476
        -2452 511 l-187 7 -118 87 c-362 268 -765 506 -1022 603 -202 77 -112 71
        -1125 73 -500 1 -919 0 -930 -2z m1483 -278 c43 -46 175 -194 292 -328 117
        -134 235 -266 263 -294 31 -33 48 -58 45 -70 -3 -18 -33 -19 -887 -22 -749 -2
        -888 0 -906 12 -51 33 -121 207 -180 447 -46 185 -53 256 -28 287 41 50 53 51
        709 52 l612 0 80 -84z m383 44 c181 -60 441 -190 774 -385 229 -134 344 -212
        357 -240 19 -42 0 -75 -61 -107 l-53 -28 -275 0 -276 0 -251 247 c-327 321
        -454 455 -462 489 -6 22 -2 31 17 47 32 26 108 18 230 -23z m-1943 -82 c21
        -56 94 -338 137 -528 14 -63 28 -123 31 -132 5 -17 -35 -18 -749 -18 -734 0
        -755 1 -778 20 l-24 19 85 83 c254 248 678 462 1154 583 126 32 122 33 144
      -27z"/>
      <path d="M2098 1400 c-146 -25 -267 -89 -378 -200 -93 -93 -142 -173 -179
        -294 -109 -354 98 -745 455 -862 81 -26 101 -29 219 -28 113 0 141 4 210 27
        215 71 381 237 453 454 23 68 26 95 26 213 0 122 -2 143 -28 215 -66 190 -183
        323 -361 410 -135 66 -277 88 -417 65z m214 -201 c196 -41 355 -207 390 -407
        23 -137 -24 -303 -116 -409 -88 -101 -231 -165 -369 -165 -140 -1 -243 40
        -344 135 -106 100 -154 212 -155 358 -1 316 287 552 594 488z"/>
        <path d="M7365 1395 c-236 -51 -445 -241 -521 -471 -26 -80 -29 -101 -28 -219
        0 -112 4 -141 26 -208 72 -215 239 -383 455 -455 68 -23 95 -26 213 -26 122 0
        143 2 215 28 222 77 401 265 461 486 27 100 25 274 -5 370 -39 127 -87 206
        -181 300 -93 93 -173 142 -295 180 -93 28 -246 35 -340 15z m260 -200 c252
        -65 414 -306 375 -557 -38 -246 -246 -422 -495 -420 -452 4 -663 556 -329 861
      122 111 294 156 449 116z"/>
    </g>
  </svg>
`;

const renderCar = (car: { id: number, name: string, color: string }) => {
  const html = `
    <span id="message"></span>
    <div class="cars-buttons">
      <button class="select-button" id="select-car-${car.id}">Select</button>
      <button class="remove-button" id="remove-car-${car.id}">Remove</button>
      <span class="car-name">${car.name}</span>
    </div>
    <div class="road">
      <div class="launch-pad">
        <div class="control-panel">
          <button class="start-engine" id="start-engine-car-${car.id}">
           A
          </button>
          <button class="stop-engine" id="stop-engine-car-${car.id}" disabled="true"}>
            B
          </button>
        </div>
        <div class="car" id="car-${car.id}">
          ${renderCarImage(car.color)}
        </div>
      </div>
      <div class="flag" id="flag-${car.id}">▲</div>
    </div>
  `;
  const parentElement = document.getElementById('garage');
  if (!parentElement) throw Error('App root element not found');
  const root = document.createElement('div');
  root.setAttribute('class', `car-elements-${car.id}`);
  root.innerHTML = html;
  parentElement.appendChild(root);
};

export const renderGarage: () => Promise<void> = async () => {
  const { items: cars, count: carsCount } = await getCars(CAR_CURRENT_PAGE);
  const html = `
    <h1 class="garage__title">Garage (${carsCount})</h1>
    <h2 class="garage__pages">Page #${CAR_CURRENT_PAGE}</h2>
  `;
  const parentElement = document.getElementById('garage-page');
  if (!parentElement) throw Error('App root element not found');
  const root = document.createElement('div');
  root.setAttribute('id', 'garage');
  root.innerHTML = html;
  parentElement.appendChild(root);
  cars.map(async (car: { id: number; name: string; color: string; }) => renderCar(car)).join('');
};

export const updateStageGarage: () => Promise<void> = async () => {
  const { count: carsCount } = await getCars(1);
  let counter = 0;
  if (carsCount !== null) {
    counter = Number(carsCount);
  }

  const btnNext = <HTMLButtonElement>document.getElementById('next');
  btnNext.disabled = !(CAR_CURRENT_PAGE * 7 < counter);

  const btnPrev = <HTMLButtonElement>document.getElementById('prev');
  btnPrev.disabled = !(CAR_CURRENT_PAGE > 1);
};

const listenForPagination: () => Promise<void> = async () => {
  const btnNext = <HTMLButtonElement>document.getElementById('next');
  btnNext.addEventListener('click', async () => {
    CAR_CURRENT_PAGE++;
    await updateStageGarage();
    const garage = document.getElementById('garage');
    if (garage) {
      garage.remove();
      renderGarage();
    }
  });

  const btnPrev = <HTMLButtonElement>document.getElementById('prev');
  btnPrev.addEventListener('click', async () => {
    CAR_CURRENT_PAGE--;
    const garage = document.getElementById('garage');
    await updateStageGarage();
    if (garage !== null) {
      garage.remove();
      renderGarage();
    }
  });
};

const listenForEngine = () => {
  document.body.addEventListener('click', async (event) => {
    if ((<Element>event.target).classList.contains('start-engine')) {
      const selectedCarID = +(<Element>event.target).id.split('start-engine-car-')[1];
      startDriving(selectedCarID);
    }
    if ((<Element>event.target).classList.contains('stop-engine')) {
      const selectedCarID = +(<Element>event.target).id.split('stop-engine-car-')[1];
      stopDriving(selectedCarID);
    }
  });
};

interface IRaceCarsProps {
  success: boolean;
  id: number;
  time: number;
}

interface IRaceCarsReturnProps {
  time: number;
  id?: number | undefined;
  name?: string | undefined;
  color?: string | undefined;
}

const raceCars: (promises: Promise<IRaceCarsProps>[], ids: number[]) =>
Promise<IRaceCarsReturnProps> = async (promises, ids) => {
  const { success, id, time } = await Promise.race(promises);
  const { items: cars } = await getCars(CAR_CURRENT_PAGE);

  if (!success) {
    const failedIndex = ids.findIndex((i: number) => i === id);
    const restPromises = [...promises.slice(0, failedIndex), ...promises.slice(failedIndex + 1, promises.length)];
    const restIds = [...ids.slice(0, failedIndex), ...ids.slice(failedIndex + 1, ids.length)];
    return raceCars(restPromises, restIds);
  }

  return { ...cars.find((car) => car.id === id), time: +(time / 1000).toFixed(2) };
};

export const race: (action: (arg0: number) => Promise<IRaceCarsProps>) =>
Promise<IRaceCarsReturnProps> = async (action: (arg0: number) => Promise<{
  success: boolean;
  id: number;
  time: number;
}>) => {
  const { items: cars } = await getCars(CAR_CURRENT_PAGE);
  const promises = cars.map(({ id }) => action(id));

  const winner = await raceCars(
    promises,
    cars.map((car) => car.id),
  );
  return winner;
};

const listenForReset: () => Promise<void> = async () => {
  const btnReset = <HTMLButtonElement>document.getElementById('reset');
  btnReset.addEventListener('click', async () => {
    btnReset.disabled = true;
    const { items: cars } = await getCars(CAR_CURRENT_PAGE);
    cars.map(({ id }) => stopDriving(id));
    const message = <HTMLElement>document.getElementById('message');
    message.style.display = 'none';
    const btnRace = <HTMLButtonElement>document.getElementById('race');
    btnRace.disabled = false;
  });
};

export const listenGarage: () => Promise<void> = async () => {
  listenForEngine();
  listenForPagination();
  listenForReset();
};

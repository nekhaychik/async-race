import {
  deleteCar,
  deleteWinner,
  getWinners,
  saveWinner,
} from '../../api';
import {
  race,
  renderCarImage,
  renderGarage,
  updateStageGarage,
} from '../render-garage/render-garage';
import { startDriving } from '../start&stop driving/start-stop-driving';
import './render-winners.scss';

const LIMIT_WINNERS_ON_PAGE = 10;

let currentWinnersPage = 1;

let currentWinners = currentWinnersPage * LIMIT_WINNERS_ON_PAGE;

let sortBy = 'id';

let sortOrder = 'ASC';

interface IWinnerProps {
  id: number;
  wins: number;
  time: number;
  car: { name: string; color: string; };
}

export const renderWinnersTable: (get?: Promise<{
  items: {
    id: number;
    wins: number;
    time: number;
    car: {
      name: string;
      color: string;
    };
  }[];
  count: string | null;
}>) => Promise<void> = async (get = getWinners({
  page: currentWinnersPage,
  limit: LIMIT_WINNERS_ON_PAGE,
  sort: sortBy,
  order: sortOrder,
})) => {
  const { items: winners, count: winnersCount } = await get;
  const html = `
    <div id="winners-table__wrap">
      <h1 class="garage__title">Garage (${winnersCount})</h1>
      <h2 class="garage__pages">Page #${currentWinnersPage}</h2>
      <div id="winners-table">
        <div class="winners-table__header">
          <span>№</span>
          <span>Car</span>
          <span>Name</span>
          <button class="sort-by-wins">Wins</button>
          <button class="sort-by-time">Best time</button>
        </div>
        ${
  winners.map((winner: IWinnerProps, index: number) => `
            <div class="winners-table__winner winner-${winner.id}">
              <div>${currentWinners - LIMIT_WINNERS_ON_PAGE + index + 1}</div>
              <div class="winner-img">${renderCarImage(winner.car.color, 50)}</div>
              <div>${winner.car.name}</div>
              <div>${winner.wins}</div>
              <div>${winner.time}</div>

            </div>
          `).join('')}
      </div>
    </div>
  `;
  const parentElement = document.getElementById('winners-page');
  if (!parentElement) throw Error('App root element not found');
  const root = document.createElement('div');
  root.setAttribute('id', 'winners');
  root.innerHTML = html;
  parentElement.appendChild(root);
};

export const updateStageWinners: () => Promise<void> = async () => {
  const { count: winnersCount } = await getWinners({ page: 1 });
  let counter = 0;
  if (winnersCount !== null) {
    counter = Number(winnersCount);
  }

  const btnNext = <HTMLButtonElement>document.getElementById('next-win');
  btnNext.disabled = !(currentWinnersPage * LIMIT_WINNERS_ON_PAGE < counter);

  const btnPrev = <HTMLButtonElement>document.getElementById('prev-win');
  btnPrev.disabled = !(currentWinnersPage > 1);
};

const sorting = (typeOfSorting: string) => {
  document.body.addEventListener('click', async (event) => {
    if ((<Element>event.target).classList.contains(typeOfSorting)) {
      sortBy = String((<Element>event.target).className.split('sort-by-')[1]);
      if (sortOrder === 'ASC') sortOrder = 'DESC';
      else sortOrder = 'ASC';
      const get = getWinners({
        page: currentWinnersPage,
        limit: LIMIT_WINNERS_ON_PAGE,
        sort: sortBy,
        order: sortOrder,
      });
      await updateStageWinners();
      const winners = document.getElementById('winners-table__wrap');
      if (winners) {
        winners.remove();
        renderWinnersTable(get);
      }
    }
  });
};

const listenForSort = async () => {
  const sortingByWins = 'sort-by-wins';
  const sortingByTime = 'sort-by-time';
  sorting(sortingByWins);
  sorting(sortingByTime);
};

const listenForRemove: () => Promise<void> = async () => {
  document.body.addEventListener('click', async (event) => {
    if ((<Element>event.target).classList.contains('remove-button')) {
      const selectedCarID = +(<Element>event.target).id.split('remove-car-')[1];
      await deleteCar(selectedCarID);
      await deleteWinner(selectedCarID);
      await updateStageWinners();
      await updateStageGarage();
      const winners = document.getElementById('winners-table__wrap');
      const garage = document.getElementById('garage');
      if (garage && winners) {
        winners.remove();
        garage.remove();
        renderWinnersTable();
        renderGarage();
      }
    }
  });
};

export const listenForPaginationWinners: () => Promise<void> = async () => {
  const btnNext = <HTMLButtonElement>document.getElementById('next-win');
  btnNext.addEventListener('click', async () => {
    currentWinnersPage++;
    currentWinners = currentWinnersPage * LIMIT_WINNERS_ON_PAGE;
    await updateStageWinners();
    const winnersTable = document.getElementById('winners-table__wrap');
    if (winnersTable !== null) {
      winnersTable.remove();
      renderWinnersTable();
    }
  });

  const btnPrev = <HTMLButtonElement>document.getElementById('prev-win');
  btnPrev.addEventListener('click', async () => {
    currentWinnersPage--;
    currentWinners = currentWinnersPage * LIMIT_WINNERS_ON_PAGE;
    const garage = document.getElementById('winners-table__wrap');
    await updateStageWinners();
    if (garage !== null) {
      garage.remove();
      renderWinnersTable();
    }
  });
};

const listenForRace = async () => {
  const btnRace = <HTMLButtonElement>document.getElementById('race');
  btnRace.addEventListener('click', async () => {
    btnRace.disabled = true;
    const winner = await race(startDriving);
    await saveWinner(winner);
    const message = <HTMLElement>document.getElementById('message');
    message.textContent = `${winner.name} went first (${winner.time}sec)`;
    message.style.display = 'block';
    const btnReset = <HTMLButtonElement>document.getElementById('reset');
    btnReset.disabled = false;
    await updateStageWinners();
    const winnersTable = document.getElementById('winners-table__wrap');
    if (winnersTable !== null) {
      winnersTable.remove();
      renderWinnersTable();
    }
  });
};

export const listenWinners: () => Promise<void> = async () => {
  listenForPaginationWinners();
  listenForRace();
  listenForRemove();
  listenForSort();
};

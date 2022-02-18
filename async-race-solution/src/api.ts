const base = 'http://localhost:3000';

const garage = `${base}/garage`;
const engine = `${base}/engine`;
const winners = `${base}/winners`;

interface IGetWinnerProps {
  page: number;
  limit?: number;
  sort?: string;
  order?: string;
}

interface IItem {
  id: number;
  wins: number;
  time: number;
  car: { name: string; color: string; };
}

interface IGetWinnersReturnValue {
  items: Array<IItem>;
  count: string | null;
}

const GetWinnersDefaultProps = {
  limit: 10,
  sort: 'id',
  order: 'ACS',
};

interface IWinnerProps {
  time: number;
  id?: number | undefined;
  name?: string;
  color?: string;
}

export const getCars: (page: number, limit?: number) =>Promise<{
  items: Array<{ id: number; name: string; color: string;
  }>, count: string | null ;
}> = async (page: number, limit = 7) => {
  const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
  return {
    items: await response.json(),
    count: response.headers.get('X-Total-Count'),
  };
};

export const getCar: (id: number) =>
Promise<{ name: string; color: string; }> = async (id: number) => (await fetch(`${garage}/${id}`)).json();

export const createCar: (body: { name: string; color: string; }) =>
Promise<void> = async (body: { name: string; color: string; }) => (await fetch(garage, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

export const deleteCar: (id: number) =>
Promise<void> = async (id: number) => (await fetch(`${garage}/${id}`, { method: 'DELETE' })).json();

export const updateCar: (id: number, body: { name: string; color: string; }) =>
Promise<void> = async (id: number, body: { name: string; color: string; }) => (await fetch(`${garage}/${id}`, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

export const startEngine: (id: number) =>
Promise<{ velocity: number,
  distance: number
}> = async (id: number) => (await fetch(`${engine}?id=${id}&status=started`)).json();

export const stopEngine: (id: number) =>
Promise<void> = async (id: number) => (await fetch(`${engine}?id=${id}&status=stopped`)).json();

export const drive: (id: number) => Promise<{ success: boolean }> = async (id: number) => {
  const res = await fetch(`${engine}?id=${id}&status=drive`).catch();
  return res.status !== 200 ? { success: false } : { ...(await res.json()) };
};

const getSortOrder: (sort: string, order: string) => string = (sort: string, order: string) => {
  if (sort && order) return `&_sort=${sort}&_order=${order}`;
  return '';
};

export const getWinners: (props: IGetWinnerProps) =>
Promise<IGetWinnersReturnValue> = async (props: IGetWinnerProps) => {
  const {
    page,
    limit,
    sort,
    order,
  } = { ...GetWinnersDefaultProps, ...props };
  const response = await fetch(`${winners}?_page=${page}&_limit=${limit}${getSortOrder(sort, order)}`);
  const items = await response.json();

  return {
    items: await Promise.all(items.map(async (win: { id: number; }) => ({ ...win, car: await getCar(win.id) }))),
    count: response.headers.get('X-Total-Count'),
  };
};

export const getWinner: (id: number) =>
Promise<IItem> = async (id: number) => (await fetch(`${winners}/${id}`)).json();

export const getWinnerStatus: (id: number) =>
Promise<number> = async (id: number) => (await fetch(`${winners}/${id}`)).status;

export const deleteWinner: (id: number) =>
Promise<void> = async (id: number) => (await fetch(`${winners}/${id}`, { method: 'DELETE' })).json();

export const createWinner: (body: { id: number; wins: number; time: number; }) =>
Promise<void> = async (body: { id: number; wins: number; time: number; }) => (await fetch(winners, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

export const updateWinner: (id: number, body: { id: number; wins: number; time: number; }) =>
Promise<void> = async (id: number, body: {
  id: number;
  wins: number;
  time: number;
}) => (await fetch(`${winners}/${id}`, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

export const saveWinner: (winner: IWinnerProps) =>
Promise<void> = async (winner: { id?: number, time: number }) => {
  if (winner.id !== undefined) {
    const winnerStatus = await getWinnerStatus(winner.id);
    if (winnerStatus === 404) {
      await createWinner({
        id: winner.id,
        wins: 1,
        time: winner.time,
      });
    } else {
      const currentWinner = await getWinner(winner.id);
      await updateWinner(winner.id, {
        id: winner.id,
        wins: currentWinner.wins + 1,
        time: winner.time < currentWinner.time ? winner.time : currentWinner.time,
      });
    }
  }
};

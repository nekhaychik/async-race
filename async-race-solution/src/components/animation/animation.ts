interface ICarData {
  name: string;
  id: number;
}

function getPositionAtCenter(el: HTMLElement) {
  const {
    top,
    left,
    width,
    height,
  } = el.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

export function getDistanceBetweenElements(a: HTMLElement, b: HTMLElement): number {
  const aPosition = getPositionAtCenter(a);
  const bPosition = getPositionAtCenter(b);

  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
}

export function animation(car: HTMLElement, distance: number, animationTime: number): ICarData {
  let start = 0;
  const state: ICarData = { name: '', id: 1 };

  function step(timetamp: number) {
    if (!start) start = timetamp;
    const time = timetamp - start;
    const passed = Math.round(time * (distance / animationTime));

    car.style.transform = `translateX(${Math.min(passed, distance)}px)`;

    if (passed < distance) {
      state.id = window.requestAnimationFrame(step);
    }
  }

  state.id = window.requestAnimationFrame(step);

  return state;
}

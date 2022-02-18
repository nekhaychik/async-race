import { drive, startEngine, stopEngine } from '../../api';
import { animation, getDistanceBetweenElements } from '../animation/animation';

let animationCar: { name: string; id: number; };

export const startDriving: (id: number) => Promise<{
  success: boolean;
  id: number;
  time: number;
}> = async (id: number) => {
  const btnStartEngine = <HTMLButtonElement>document.getElementById(`start-engine-car-${id}`);
  const btnStopEngine = <HTMLButtonElement>document.getElementById(`stop-engine-car-${id}`);
  btnStartEngine.disabled = true;

  const { velocity, distance } = await startEngine(id);
  const time = Math.round(distance / velocity);

  btnStopEngine.disabled = false;

  const car = document.getElementById(`car-${id}`);
  const flag = document.getElementById(`flag-${id}`);
  if (car !== null && flag !== null) {
    const htmlDistance = Math.floor(getDistanceBetweenElements(car, flag)) + 70;
    animationCar = animation(car, htmlDistance, time);
  }

  const { success } = await drive(id);
  if (!success) window.cancelAnimationFrame(animationCar.id);

  return { success, id, time };
};

export const stopDriving: (id: number) => Promise<void> = async (id: number) => {
  const btnStartEngine = <HTMLButtonElement>document.getElementById(`start-engine-car-${id}`);
  const btnStopEngine = <HTMLButtonElement>document.getElementById(`stop-engine-car-${id}`);
  btnStopEngine.disabled = true;

  await stopEngine(id);
  btnStartEngine.disabled = false;

  const car = document.getElementById(`car-${id}`);
  if (car !== null) {
    car.style.transform = 'translateX(0)';
  }

  btnStartEngine.disabled = false;
  if (animationCar) window.cancelAnimationFrame(animationCar.id);
};

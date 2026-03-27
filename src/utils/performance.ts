export function monitorPerformance() {
  let lastTime = performance.now();
  let frames = 0;
  let fps = 60;

  function measureFPS() {
    const currentTime = performance.now();
    frames++;

    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frames * 1000) / (currentTime - lastTime));
      frames = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
  }

  measureFPS();

  return {
    getCurrentFPS: () => fps,
  };
}

export function measureActionTime(action: () => void): number {
  const start = performance.now();
  action();
  const end = performance.now();
  return end - start;
}

export async function measureAsyncActionTime(action: () => Promise<void>): Promise<number> {
  const start = performance.now();
  await action();
  const end = performance.now();
  return end - start;
}

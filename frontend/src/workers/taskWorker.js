self.onmessage = (e) => {
  const { task, duration, interval } = e.data;
  const start = task.start;
  const end = task.end;

  const totalFrames = duration / interval;
  let frame = 0;

  const dx = (end[0] - start[0]) / totalFrames;
  const dy = (end[1] - start[1]) / totalFrames;

  const startTime = Date.now();

  const intervalId = setInterval(() => {
    frame++;
    const now = Date.now();
    const elapsed = now - startTime;

    const currentPosition = [
      start[0] + dx * frame,
      start[1] + dy * frame,
    ];

    const isDone = frame >= totalFrames;

    self.postMessage({
      currentPosition,
      elapsed,
      isDone,
    });

    if (isDone) {
      clearInterval(intervalId);
    }
  }, interval);
};

type Task<T> = {
  taskId: string;
  taskData: any;
  resolve: (result: T) => void;
  reject: (error: Error) => void;
};

export class WorkerPool<T> {
  private workers: Worker[];
  private taskQueue: Task<T>[];
  private activeTasks: Map<string, Task<T>>;
  private workerScript: string;

  constructor(workerScript: string, private poolSize: number = 4) {
    this.workerScript = workerScript; // Path to the worker script
    this.workers = [];
    this.taskQueue = [];
    this.activeTasks = new Map();

    // Initialize workers
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript); // Reference public directory
      worker.onmessage = (event) => this.handleWorkerResponse(worker, event);
      worker.onerror = (error) => this.handleWorkerError(worker, error);
      this.workers.push(worker);
    }
  }

  private handleWorkerResponse(worker: Worker, event: MessageEvent) {
    const { taskId, result, error } = event.data;

    const task = this.activeTasks.get(taskId);
    if (task) {
      if (error) {
        task.reject(new Error(error));
      } else {
        task.resolve(result);
      }
      this.activeTasks.delete(taskId);
    }

    this.assignTask(worker);
  }

  private handleWorkerError(worker: Worker, error: ErrorEvent) {
    console.error("Worker encountered an error:", error.message, error);
    const taskId = [...this.activeTasks.keys()].find(
      (id) => this.activeTasks.get(id)?.taskData.worker === worker
    );

    if (taskId) {
      const task = this.activeTasks.get(taskId);
      if (task) {
        task.reject(new Error(`Worker failed with error: ${error.message}`));
        this.activeTasks.delete(taskId);
      }
    }

    this.assignTask(worker); // Continue processing queued tasks
  }

  private assignTask(worker: Worker) {
    if (this.taskQueue.length === 0) return;

    const task = this.taskQueue.shift()!;
    this.activeTasks.set(task.taskId, task);
    worker.postMessage({ taskId: task.taskId, ...task.taskData });
  }

  runTask(taskData: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const taskId = `${Date.now()}-${Math.random()}`;
      const task: Task<T> = { taskId, taskData, resolve, reject };
      this.taskQueue.push(task);

      const availableWorker = this.workers.find(
        (worker) =>
          ![...this.activeTasks.values()].some(
            (task) => task.taskData.worker === worker
          )
      );

      if (availableWorker) this.assignTask(availableWorker);
    });
  }

  terminate() {
    this.workers.forEach((worker) => worker.terminate());
  }
}

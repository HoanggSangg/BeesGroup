class ProcessCancellationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ProcessCancellationError";
    }
  }
  
async function processWithDelay(
    numbers: number[],
    delay: number = 1000
  ): Promise<void> {
    if (!Array.isArray(numbers) || !numbers.every(num => typeof num === "number")) {
      throw new Error("Dữ liệu đưa vào không hợp lệ.");
    }
  
    for (const num of numbers) {
      console.log(num);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  processWithDelay([1, 2, 3, 4, 5])
    .then(() => console.log("Xử lý hoàn tất"))
    .catch(err => console.error("Error:", err.message));
  
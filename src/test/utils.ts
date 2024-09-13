export function promiseDone(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve))
}

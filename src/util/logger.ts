class Logger {

  static log(...message: any) {
    const filename = new Error().stack.split("\n")[2].split("\\build\\").pop()
    console.log(`[${Logger.getTime()}] [${filename}]`, ...message)
  }

  static error(...message: any) {
    const filename = new Error().stack.split("\n")[2].split("\\build\\").pop()
    console.error(`[${Logger.getTime()}] [${filename}]`, ...message)
  }

  static warn(...message: any) {
    const filename = new Error().stack.split("\n")[2].split("\\build\\").pop()
    console.warn(`[${Logger.getTime()}] [${filename}]`, ...message)
  }

  private static getTime() {
    const date = new Date()
    return (
      date.getFullYear() + "-" + 
      ((date.getMonth() + 1 > 9) ? "" : 0) + (date.getMonth() + 1) + "-" + 
      ((date.getDate() > 9) ? "" : 0) + date.getDate() + "T" + 
      ((date.getHours() > 9) ? "" : 0) + date.getHours() + ":" + 
      ((date.getMinutes() > 9) ? "" : 0) + date.getMinutes() + ":" + 
      ((date.getSeconds() > 9) ? "" : 0) + date.getSeconds() + "." + date.getMilliseconds())
  }
}

export default Logger;
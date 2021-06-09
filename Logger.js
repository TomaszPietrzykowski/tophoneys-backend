const EventEmitter = require("events")
const fs = require("fs")
const path = require("path")
const uuid = require("uuid")

class Logger extends EventEmitter {
  log(msg) {
    this.emit("log", { log_id: uuid.v4(), msg })
  }

  show(date) {
    this.emit("show", date)
  }
}

const logger = new Logger()
logger.on("log", (data) => {
  fs.mkdir(path.join(__dirname, "/logs"), { recursive: true }, (err) => {
    if (err) throw err
    const currentDate = new Date()
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth() + 1
    const d = currentDate.getDate()
    fs.appendFile(
      path.join(__dirname, "/logs", `log_${d}_${m}_${y}.txt`),
      `\n \n ******************************** \n Log timestamp:\n ${new Date()} \n Log id: \n ${
        data.log_id
      } \n \n Log message: \n ${data.msg} \n`,
      (err) => {
        if (err) throw err
        console.log("New input in log.txt added...")
      }
    )
  })
})
logger.on("show", (reqDate) => {
  const currentDate = new Date()
  const y = currentDate.getFullYear()
  const m = currentDate.getMonth()
  const d = currentDate.getDate()
  const fileName = reqDate
    ? `log_${reqDate.replace(/-/g, "_")}.txt`
    : `log_${d}_${m}_${y}.txt`
  if (!fs.existsSync(`./logs/${fileName}`)) {
    console.log(
      "\n * * * * * * * \n Logger message: \n The log file for this date does not exist yet. \n Use: logger.log(mesage:string) to create log file and your first log \n Or: try passing another date to .show method: logger.show(DD-MM-YYY:string) \n * * * * * * *"
    )
  } else {
    fs.readFile(path.join("./", "/logs", fileName), "utf8", (err, data) => {
      if (err) throw err
      console.log(data)
    })
  }
})

module.exports = logger

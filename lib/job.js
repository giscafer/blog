/* eslint-disable */
const cron = require('node-cron')
const syncPost = require('./github/syncPost')

// # ┌───────────── minute (0 - 59)
// # │ ┌───────────── hour (0 - 23)
// # │ │ ┌───────────── day of the month (1 - 31)
// # │ │ │ ┌───────────── month (1 - 12)
// # │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
// # │ │ │ │ │
// # │ │ │ │ │
// # │ │ │ │ │
// # * * * * *
// const timeString = '15 * * * *'
const timeString = '0 1 * * *' // Running a job at 01:00 every day

let job = null

function stopJob() {
  if (job) {
    job.stop()
    job = null
  }
}

function startJob() {
  stopJob()
  // http://crontab.org/
  job = cron.schedule(
    timeString,
    () => {
      // eslint-disable-next-line no-console
      console.log('🚀🚀 同步issue到mdx文件')
      syncPost()
    },
    {
      scheduled: true,
      timezone: 'Asia/Shanghai',
    },
  )

  job.start()
  console.log('====================================')
  console.log('🚀🚀 同步代码定时任务已开启')
  console.log('====================================')
}

// syncPost() // 先执行一次

export { startJob }

/* eslint-disable */
const cron = require('node-cron')
const syncPost = require('./syncPost')

// https://www.npmjs.com/package/node-cron
// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *
// const timeString = '15 * * * *'
const timeString = '* 0 1 * * *' // Running a job at 01:00 every day

let job = null

function stopJob() {
  if (job) {
    job.stop()
    job = null
  }
}

function startJob() {
  stopJob()
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

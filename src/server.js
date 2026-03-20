import app from './app.js'
import './database/index.js'

const PORT = process.env.PORT || 3001
// Log uncaught exceptions and unhandled rejections so platform logs show stack traces
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err && err.stack ? err.stack : err)
})

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason && reason.stack ? reason.stack : reason)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

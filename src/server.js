import app from './app.js'
import './database/index.js'

const port = process.env.PORT

app.listen(port, () => console.log(`Server is running on port ${port}...`))

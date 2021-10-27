const express = require('express')
const config = require('config')
const mongo = require('mongoose')
const path  = require('path')

const app = express();
const PORT = config.get('port') || 5000

app.use(express.json({ extended: true}));

app.use('/api/auth', require("./routers/auth"));
app.use('/api/link', require("./routers/link"));
app.use('/t', require("./routers/ridirect.routes"))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

async function start() {
    try {
        await mongo.connect(config.get('mongoUri'), {
            useUnifiedTopology: true,
            useNewUrlParser: true
        } )
        app.listen(PORT, ()=> console.log(`App has been started on port ${PORT}`))
    }
    catch (e) {
        console.log('Server Error', e.message)
        process.exit(1);
    }
}

start();
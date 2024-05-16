require('dotenv').config();
const fastify = require('fastify');
const app = fastify();
const util = require('minecraft-server-util');
const path = require('path');
app.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs')
    },
    root: path.join(__dirname, "views")
})
app.register(require('@fastify/static'), {
    root: path.join(__dirname, 'views/assets'),
    prefix: '/assets'
})
app.get('/api/v1/ping/java', async(req, reply) => {
    let {ip, port} = req.query;
    if(!port) port = 25565
    let data = await util.status(ip, Number(port), {
        enableSRV: true,
        timeout: 1000 * 5
    })
    return reply.send(data);
})
app.get('/api/v1/motd/java', async(req, reply) => {
    let {ip, port} = req.query;
    if(!port) port = 25565
    let data = await fetch(`http://${process.env.HOST}:${process.env.PORT}/api/v1/ping/java?ip=${ip}&port=${port}`).then(res => res.json());
    console.log(data.motd)
    return reply.view('motd.ejs', {
        motd: data.motd,
        favicon: data.favicon,
        ip: ip
    })
})
app.get('/', async(req, reply) => {
    reply.send({message: 'API is alive'});
})
app.listen({
    port: process.env.PORT,
    host: process.env.HOST
}, (err, address) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`server listening on ${address}`);
})
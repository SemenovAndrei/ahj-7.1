const Ticket = require('./src/Ticket').Ticket
const AddTickets = require('./src/AddTickets').AddTickets

let tickets = []
let ticketsFull = []

const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const koaBody = require('koa-body')

const app = new Koa()

app.use(cors())

app.use(koaBody({ json: true }))

let nextId = 1

const router = new Router()

router.get('/tickets', async (ctx, next) => {
  const { method } = ctx.request.query
  if (method === 'allTickets') {
    ctx.response.body = tickets
  }

  if (method === 'ticketById') {
    const { id } = ctx.request.query
    ctx.response.body = ticketsFull.find((e) => e.id === Number(id))
  }

  console.log(ctx.response.body)
  ctx.response.status = 204
})

router.post('/tickets', async (ctx, next) => {
  const { method } = ctx.request.query
  if (method === 'createTicket') {
    const { name, description } = JSON.parse(ctx.request.body)
    const ticketFull = new Ticket(name, description, nextId++)
    const { description: removeKey, ...ticket } = ticketFull
    console.log(ticket)
    ticketsFull.push(ticketFull)
    tickets.push(ticket)
    ctx.response.status = 204
  }
})

router.delete('/tickets/:id', async (ctx, next) => {
  console.log(ctx.params.id)
  const ticketId = Number(ctx.params.id)

  tickets = tickets.filter((o) => o.id !== ticketId)
  ticketsFull = tickets.filter((o) => o.id !== ticketId)
  ctx.response.status = 204
})

app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 7777
const server = http.createServer(app.callback())
server.listen(port, () => console.log('server started'))

const addTickets = new AddTickets()
addTickets.addTickets()

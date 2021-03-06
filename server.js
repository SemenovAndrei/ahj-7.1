const Ticket = require('./src/Ticket').Ticket
const AddTickets = require('./src/AddTickets').AddTickets

let tickets = []
let ticketsFull = []

const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const koaBody = require('koa-body')({ json: true, text: true, urlencoded: true })

const app = new Koa()

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)

// app.use(koaBody)

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
})

router.post('/tickets', koaBody, async (ctx, next) => {
  const { method } = ctx.request.query

  if (method === 'createTicket') {
    const { name, description } = await JSON.parse(ctx.request.body)
    const ticketFull = new Ticket(name, description, nextId++)
    const { description: removeKey, ...ticket } = ticketFull

    ticketsFull.push(ticketFull)
    tickets.push(ticket)

    ctx.response.status = 204
  }
})

router.delete('/tickets/:id', async (ctx, next) => {
  console.log(ctx.params.id)
  const ticketId = Number(ctx.params.id)

  tickets = tickets.filter((o) => o.id !== ticketId)
  ticketsFull = ticketsFull.filter((o) => o.id !== ticketId)
  ctx.response.status = 204
})

router.put('/tickets/:id', koaBody, async (ctx, next) => {
  const ticketId = Number(ctx.params.id)
  console.log(ticketId)

  index = tickets.findIndex((o) => o.id === ticketId)
  const { status, name, description } = await JSON.parse(ctx.request.body)

  if (status !== 'undefined') {
    tickets[index].status = status
    ticketsFull[index].status = status
  }

  if (name) {
    tickets[index].name = name
    ticketsFull[index] = { ...ticketsFull[index], name: name, description: description }
  }

  ctx.response.status = 204
})

app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 7777
const server = http.createServer(app.callback())
server.listen(port, () => console.log('server started'))

const addTickets = new AddTickets()
addTickets.addTickets()

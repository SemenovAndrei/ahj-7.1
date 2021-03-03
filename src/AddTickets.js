// import faker from 'faker'
const Faker = require('faker')
const fetch = require('node-fetch')

class AddTickets {
  constructor() {
    this.url = 'http://localhost:7777/tickets?method=createTicket'
    this.tickets = [
      {
        name: 'сделать прототип API',
        description:
          'Пока backend-разработчик находится в отпуске, вам поручили сделать прототип API для сервиса управления заявками на помощь (можете за себя порадоваться, так недалеко и до fullstack), к которому вам и нужно будет в дальнейшем прикрутить frontend.',
      },
      {
        name: Faker.company.bsAdjective(),
        description: Faker.lorem.paragraphs(3, '\n'),
      },
    ]
  }

  addTickets() {
    this.tickets.forEach((ticket) => {
      fetch(this.url, {
        method: 'POST',
        'Content-Type': 'application / json',
        body: JSON.stringify(ticket),
      }).then((response) => {
        if (response.status === 204) {
          console.log('ok')
        }
      })
    })
  }
}

module.exports = {
  AddTickets: AddTickets,
}

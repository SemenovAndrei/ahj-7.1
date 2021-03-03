class Ticket {
  constructor(name, description, id) {
    this.name = name
    this.description = description
    this.id = id
    this.status = false
    this.created = Date.now()
  }
}

module.exports = {
  Ticket: Ticket,
}

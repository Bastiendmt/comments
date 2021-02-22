let connection = require('../config/db')
let moment = require('../config/moment')


class Message {
    constructor(row) {
        this.row = row
    }

    get content() {
        return this.row.content
    }

    get created_at() {
        return moment(this.row.created_at)
    }

    get id() {
        return this.row.id
    }

    static create(content, callback) {
        connection.query('INSERT INTO messages SET content = ?, created_at = ?', [content, new Date()], (err, res) => {
            if (err) throw err;
            callback(res)
        })
    }

    static all(callback) {
        connection.query('SELECT * FROM  messages ORDER BY created_at DESC', (err, rows) => {
            if (err) throw err;
            callback(rows.map((row) => new Message(row)))
        })
    }

    static find(id, callback) {
        connection.query('SELECT * FROM  messages WHERE id = ?', [id], (err, rows) => {
            if (err) throw err;
            callback(new Message(rows[0]))
        })
    }
}

module.exports = Message
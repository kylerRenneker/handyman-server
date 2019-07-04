const xss = require('xss')

const QuoteService = {
    insertQuote(db, newQuote) {
        return db
            .insert(newQuote)
            .into('quote_requests')
    }
}

module.exports = QuoteService
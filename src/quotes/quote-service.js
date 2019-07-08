const xss = require('xss')

const QuoteService = {
    insertQuote(db, newQuote) {
        return db
            .insert(newQuote)
            .into('quote_requests')
    },
    serializeQuote(quote) {
        return {
            provider_id: quote.provider_id,
            user_id: quote.user_id,
            location: xss(quote.location),
            email: xss(quote.email),
            description: xss(quote.description),
            services: quote.services
        }
    }
}

module.exports = QuoteService
const xss = require('xss')

const QuoteService = {
    insertQuote(db, newQuote) {
        return db
            .insert(newQuote)
            .into('quote_requests')
    },

    getQuotesForHandyman(db, id) {
        return db
            .from('quote_requests AS req')
            .select(
                'req.id',
                'req.description',
                'req.services',
                'req.date_created',
                db.raw(
                    `row_to_json(
                      (SELECT tmp FROM (
                        SELECT
                          usr.id,
                          usr.user_name,
                          usr.full_name,
                          usr.email,
                          usr.date_created,
                          usr.date_modified
                      ) tmp)
                    ) AS "user"`
                )
            )
            .leftJoin(
                'users AS usr',
                'req.user_id',
                'usr.id',
            )
            .where('req.provider_id', id)
            .groupBy('req.id', 'usr.id')
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
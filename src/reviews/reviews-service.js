const xss = require('xss')

const ReviewsService = {
    getById(db, id) {
        return db
            .from('provider_reviews AS rev')
            .select(
                'rev.id',
                'rev.rating',
                'rev.text',
                'rev.date_created',
                'rev.provider_id',
                db.raw(
                    `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.user_name,
                usr.full_name,
                usr.date_created,
                usr.date_modified
            ) tmp)
          ) AS "user"`
                )
            )
            .leftJoin(
                'thingful_users AS usr',
                'rev.user_id',
                'usr.id',
            )
            .where('rev.id', id)
            .first()
    },

    insertReview(db, newReview) {
        return db
            .insert(newReview)
            .into('provider_reviews')
            .returning('*')
            .then(([review]) => review)
            .then(review =>
                ReviewsService.getById(db, review.id)
            )
    },

    serializeReview(review) {
        return {
            id: review.id,
            rating: review.rating,
            text: xss(review.text),
            thing_id: review.provider_id,
            date_created: review.date_created,
            user: review.user || {},
        }
    }
}

module.exports = ReviewsService
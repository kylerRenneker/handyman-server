// const xss = require('xss')
// const Treeize = require('treeize')

const handymenService = {
    getHandymenByLocation(db, zipcode) {
        console.log(zipcode)
        return db
            .from('providers')
            .select(
                'providers.id',
                'providers.provider_name',
                'providers.introduction',
                'providers.services',
                'providers.location',
                db.raw(
                    'AVG(rev.rating) AS average_review_rating'
                ),
            )
            .leftJoin(
                'provider_reviews AS rev',
                'providers.id',
                'rev.provider_id',
            )
            .groupBy('providers.id')
            .where('providers.location', zipcode)
    },
    getById(db, id, zipcode) {
        return handymenService.getHandymenByLocation(db, zipcode)
            .where('providers.id', id)
            .first()
    },
    getReviewsForHandymen(db, id) {
        return db
            .from('provider_reviews AS rev')
            .select(
                'rev.id',
                'rev.text',
                'rev.rating',
                'rev.date_created',
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
                'users AS usr',
                'rev.user_id',
                'usr.id',
            )
            .where('rev.provider_id', id)
            .groupBy('rev.id', 'usr.id')
    }
}

const userFields = [
    'usr.id AS user_id',
    'usr.user_name AS user_username',
    'usr.full_name AS user_fullName',
    'usr.date_created AS user_dateCreated',
    'usr.date_modified AS user_dateModified'
]

module.exports = handymenService
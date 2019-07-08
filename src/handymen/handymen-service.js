const xss = require('xss')
const Treeize = require('treeize')

const handymenService = {
    getHandymenByLocation(db, zipcode) {
        console.log(zipcode)
        return db
            .from('providers')
            .select(
                'providers.id',
                'providers.user_id',
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
    },

    serializeProviders(providers) {
        return providers.map(this.serializeProvider)
    },

    serializeProvider(provider) {
        const providerTree = new Treeize()
        const providerData = providerTree.grow([provider]).getData()[0]

        return {
            id: providerData.id,
            user_id: providerData.user_id,
            provider_name: xss(providerData.provider_name),
            introduction: xss(providerData.introduction),
            services: providerData.services,
            location: xss(providerData.location),
            date_created: providerData.date_created,
            number_of_reviews: Number(providerData.number_of_reviews) || 0,
            average_review_rating: Math.round(providerData.average_review_rating) || 0,
        }
    },

    serializeProviderReviews(reviews) {
        return reviews.map(this.serializeProviderReview)
    },

    serializeProviderReview(review) {
        const reviewTree = new Treeize()
        const reviewData = reviewTree.grow([review]).getData()[0]

        return {
            id: reviewData.id,
            rating: reviewData.rating,
            provider_id: reviewData.provider_id,
            text: xss(reviewData.text),
            user: reviewData.user || {},
            date_created: reviewData.date_created
        }
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
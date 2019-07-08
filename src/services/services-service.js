const ServiceListService = {
    getAllServices(db) {
        return db
            .from('provider_services AS service')
            .select(
                'service.id',
                'service.name'
            )
    }
}

module.exports = ServiceListService
import BlacklistModel from "../models/blacklist.model.js";

export default class BlacklistDaoMongo {
    constructor() {
        this.model = BlacklistModel;
    }

    async insert(data) {
        return await this.model.create(data);
    }

    async getOne(filter) {
        return await this.model.findOne(filter);
    }
}
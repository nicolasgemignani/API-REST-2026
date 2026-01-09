import MongoSingleton from "../db/mongo.singleton.js"

export default async () => {
    return await MongoSingleton.getInstance()
}
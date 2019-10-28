const Resource = require("../models/resource");
const Path = require("../models/path");
const responseTemplateDto = require('../dto/responsetemplatedto');
const resTheMockTemplateDto = require('../dto/resthemocktemplatedto');

const compare = (reqValue, dbValue) => {
    return reqValue === dbValue ? true : false;
};

const compareHeaders = (reqValues, dbValues) => {
    const dbHeaderKeys = dbValues ? Object.keys(dbValues) : Object.keys({});
    const dbHeaderValues = dbValues ? Object.values(dbValues) : Object.values({});
    for (let i = 0; i < dbHeaderKeys.length; i = i + 1) {
        if (!reqValues[dbHeaderKeys[i]] || reqValues[dbHeaderKeys[i]] != dbHeaderValues[i]) {
            return false;
        }
    }
    return true;
};

exports.compareThenMockRes = (req, res, next) => {
    const urlPath = req.url.toLowerCase();
    const method = req.method.toUpperCase();
    const headers = req.headers;
    const reqBody = Object.getOwnPropertyNames(req.body).length !== 0 ? JSON.stringify(req.body) : undefined;

    Path.find()
        .where({ path: urlPath })
        .exec()
        .then(path => {
            if (!path || !path.length) {
                return res.status(404).json(responseTemplateDto(null, "Path Not Found!", 404));
            }
            path = path[0];
            Resource.find().where({
                pathId: path._id,
                method: method
            }).select("_id method headers reqBody resBody success error")
                .exec()
                .then(resource => {
                    if (!resource || !resource.length) {
                        return res.status(404).json(responseTemplateDto(null, "Resource Not Found!", 404));
                    }
                    resource = resource[0];
                    const mockInfo = {
                        pathId: path._id,
                        resourceId: resource._id,
                    }

                    if (compare(method, resource.method)
                        && compare(reqBody, resource.reqBody)
                        && compareHeaders(headers, resource.headers)
                    ) {
                        return res.status(resource.success.statusCode).json(resTheMockTemplateDto(resource.resBody, mockInfo, resource.success.message));
                    } else {
                        return res.status(resource.error.statusCode).json(resTheMockTemplateDto(null, mockInfo, resource.error.message, resource.error.violations));
                    }
                }).catch(err => {
                    console.log(err);
                    res.status(500).json(responseTemplateDto(null, err, 500));
                });
        }).catch(err => {
            console.log(err);
            res.status(500).json(responseTemplateDto(null, err, 500));
        });
}
const mongoose = require("mongoose");
const Resource = require("../models/resource");
const Path = require("../models/path");

const getHeaders = (headers) => {
    if ((headers && typeof (headers) !== 'object')
    || Array.isArray(headers)) {
        throw new Error("'headers' type must be an {} Object if exist");
    }
    if (!headers || (typeof (headers) === 'object' && !Object.keys(headers).length))
        return undefined;

    const headerKeys = Object.keys(headers);
    const AuthKey = headerKeys.filter(key => key.toLowerCase() === 'authorization');
    const authKeyValue = AuthKey && AuthKey.length ? headers[AuthKey[0]] : null;
    if (!authKeyValue)
        return headers;

    delete headers[AuthKey[0]];
    headers["authorization"] = authKeyValue;
    return headers;
};
const getReqBody = (reqBody) => {
    if (typeof (reqBody) !== 'object' && typeof (reqBody) !== 'undefined')
        throw new Error("'reqBody' type must be {} Object or [] Array, if exist");

    return reqBody && typeof (reqBody) === 'object' && Object.keys(reqBody).length ?
        JSON.stringify(reqBody) : undefined;
};
const getResponse = (res, defaultStatusCode) => {
    const statusCode = res && res.statusCode
        ? res.statusCode : defaultStatusCode;
    const resBody = res ? res.resBody : {};
    return { statusCode, resBody };
};

exports.getAllResourcesByPathId = (req, res, next) => {
    Resource.find()
        .select("_id pathId method headers reqBody success error")
        .where({ pathId: req.params.pathId })
        .populate({ path: 'pathId', select: '_id path' })
        .sort({created_at: 'desc'})
        .exec()
        .then(results => {
            const pathName = results && results.length ? results[0].pathId['path'] : null;
            const pathId = req.params.pathId ? req.params.pathId : null;
            res.render('resource', {
                title: 'All Resources of: ' + pathName,
                pathId,
                resources: results
            });
        }).catch(err => {
            next(err);
        });
};

exports.createNewResource = (req, res, next) => {
    Path.findById(req.body.pathId)
        .then(path => {
            if (!path)
                throw new Error("Path Not Found!");

            const jsonResource = JSON.parse(req.body.jsonResource);
            const pathId = path._id;

            // method is required - check
            if (!jsonResource['method'] || !jsonResource['method'].length) {
                throw new Error("'method' is required and it must be a string type");
            }
            const method = jsonResource['method'].toUpperCase();
            // method is unique - check
            Resource.find()
                .where({ pathId, method })
                .then(resource => {

                    if (resource && resource.length)
                        throw new Error(`Resource method '${resource[0].method}' already exist, 'method' must be unique`);

                    const headers = getHeaders(jsonResource.headers);
                    const reqBody = getReqBody(jsonResource.reqBody);
                    const success = getResponse(jsonResource.success, '200');
                    const error = getResponse(jsonResource.error, '500');
                    
                    const newResource = new Resource({
                        _id: mongoose.Types.ObjectId(),
                        pathId,
                        method,
                        headers,
                        reqBody,
                        success,
                        error
                    });
                    return newResource.save();

                }).then(result => {
                    if (result)
                        req.flash('success', 'Resource created successfully, Try calling the end-point using Browser, Postman ..etc');
                    res.redirect('back');
                }).catch(err => {
                    next(err);
                });
        }).catch(err => {
            next(err);
        });
};

exports.deleteResource = (req, res, next) => {
    Resource.deleteOne({ _id: req.params.resourceId })
        .exec()
        .then(result => {
            if (result)
                req.flash('success', 'Resource Deleted Successfully');
            res.redirect('back');
        })
        .catch(err => {
            next(err);
        });
};
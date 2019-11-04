const mongoose = require("mongoose");
const Path = require("../models/path");
const Resource = require("../models/resource");

exports.getAllPaths = (req, res, next) => {
    Path.find()
        .select("_id path")
        .exec()
        .sort({created_at: 'desc'})
        .then(results => {
            res.render('path', {
                title: 'Paths',
                pathes: results
            });
        }).catch(err => {
            next(err);
        });
};

exports.createNewPath = (req, res, next) => {
    if (!req.body.path || !req.body.path.length)
        throw new Error('path is required!');

    const reqPath = req.body.path[0] !== '/'
        ? '/' + req.body.path.toLowerCase()
        : req.body.path.toLowerCase();

    if ((reqPath.length <= 2 && (reqPath === '/p' || reqPath === '/r'))
        || reqPath.startsWith('/p/') || reqPath.startsWith('/r/')) {
        throw new Error('Path cannot be created, Both /p/* & /r/* are reserved paths');
    }
    Path.find().where({ path: reqPath }).exec().then(path => {
        if (path && path.length)
            throw new Error('Duplicated Path, Path must be unique!');

        const newPath = new Path({
            _id: new mongoose.Types.ObjectId(),
            path: reqPath
        });
        newPath.save().then(result => {
            if (result)
                req.flash('success', 'Path created successfully, Click on it to create a Resource.');
            res.redirect('/p');

        }).catch(err => {
            next(err);
        });
    }).catch(err => {
        next(err);
    });
};

exports.deletePathWithAllItsRecources = (req, res, next) => {
    Resource.deleteMany({ pathId: req.params.pathId })
        .exec()
        .then(result => {
            Path.deleteOne({ _id: req.params.pathId })
                .exec()
                .then(result => {
                    if (result)
                        req.flash('success', 'Path Deleted Successfully');
                    res.redirect('/p');
                }).catch(err => {
                    next(err);
                });
        }).catch(err => {
            next(err);
        });
};

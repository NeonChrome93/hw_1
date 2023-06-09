"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRouters = exports.videoRouters = exports.videos = exports.availableResolutions = void 0;
const express_1 = require("express");
const validator_1 = require("../validator");
exports.availableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
exports.videos = [];
exports.videoRouters = (0, express_1.Router)({});
exports.videoRouters.get('/', (req, res) => {
    res.send(exports.videos);
});
exports.videoRouters.get('/:id', (req, res) => {
    const video = exports.videos.find(el => el.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else
        res.sendStatus(404);
});
exports.videoRouters.post('/', (req, res) => {
    const errors = (0, validator_1.createVideoValidation)(req.body.title, req.body.author, req.body.availableResolutions);
    if (errors) {
        return res.status(400).send({
            errorsMessages: errors
        });
    }
    //обьявить переменные по каждому ключу и значению из баду
    const dateNow = new Date();
    const dateNowPlusOneDay = new Date(+dateNow + (1000 * 60 * 60 * 24));
    const newVideo = {
        id: +dateNow,
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: dateNow.toISOString(),
        publicationDate: dateNowPlusOneDay.toISOString(),
        availableResolutions: req.body.availableResolutions
    };
    exports.videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.videoRouters.put('/:id', (req, res) => {
    //дописать по сваггеру
    let video = exports.videos.find(p => p.id === +req.params.id);
    const errors = (0, validator_1.updateVideoValidation)(req.body.title, req.body.author, req.body.availableResolutions, req.body.canBeDownloaded, req.body.minAgeRestriction, req.body.publicationDate);
    if (errors) {
        return res.status(400).send({
            errorsMessages: errors
        });
    }
    //validate params
    if (video) {
        video.title = req.body.title;
        video.author = req.body.author,
            video.availableResolutions = req.body.availableResolutions,
            video.canBeDownloaded = req.body.canBeDownloaded,
            video.minAgeRestriction = +req.body.minAgeRestriction,
            video.publicationDate = req.body.publicationDate;
        // ...
        // ...
        res.status(204).send(video);
    }
    else {
        res.sendStatus(404);
    }
});
// params, query, body, headers, method
exports.videoRouters.delete('/:id', (req, res) => {
    const video = exports.videos.find(v => v.id === +req.params.id);
    if (!video)
        return res.sendStatus(404);
    exports.videos = exports.videos.filter(v => v.id !== video.id);
    return res.sendStatus(204);
    // for (let i = 0; videos.length > i; i++) {
    //     if (videos[i].id === +req.params.id) {
    //         videos.splice(i, 1)
    //         res.sendStatus(204)
    //         return;
    //     } else res.sendStatus(404)
    // }
});
//второй делит по всем видосам
exports.deleteRouters = (0, express_1.Router)({});
exports.deleteRouters.delete('/', (req, res) => {
    exports.videos = [];
    res.sendStatus(204);
});

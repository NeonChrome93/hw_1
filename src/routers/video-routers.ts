import {Request, Response, Router} from "express";
import {createVideoValidation, updateVideoValidation} from "../validator";

export type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean,
    minAgeRestriction: null | number,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]

}

export const availableResolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ];

export let videos: VideoType[] = []

export const videoRouters = Router({})

videoRouters.get('/', (req: Request, res: Response) => {
    res.send(videos)
})

videoRouters.get('/:id', (req: Request, res: Response) => {
    const video: VideoType = videos.find(el => el.id === +req.params.id)
    if (video) {
        res.send(video)
    } else res.sendStatus(404)
})

videoRouters.post('/', (req: Request, res: Response) => {
    const errors = createVideoValidation(req.body.title, req.body.author, req.body.availableResolutions)
    if (errors) {
        return res.status(400).send({
            errorsMessages: errors
        })
    }

    //обьявить переменные по каждому ключу и значению из баду
    const dateNow = new Date()
    const dateNowPlusOneDay = new Date(+dateNow + (1000 * 60 * 60 * 24))
    const newVideo: VideoType = {
            id: +dateNow,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: dateNow.toISOString(),
            publicationDate: dateNowPlusOneDay.toISOString(),
            availableResolutions: req.body.availableResolutions
        }

    videos.push(newVideo)
    res.status(201).send(newVideo)
})

videoRouters.put('/:id', (req: Request, res: Response) => {
    //дописать по сваггеру

    const errors = updateVideoValidation(req.body.title, req.body.author, req.body.availableResolutions,
        req.body.canBeDownloaded, req.body.minAgeRestriction, req.body.publicationDate)
    if (errors) {
        return res.status(400).send({
            errorsMessages: errors
        })
    }
    //validate params
    let video = videos.find(p => p.id === +req.params.id)
    if (video) {
        video.title = req.body.title
        video.author = req.body.author,
        video.availableResolutions = req.body.availableResolutions,
        video.canBeDownloaded = req.body.canBeDownloaded,
        video.minAgeRestriction = +req.body.minAgeRestriction,
        video.publicationDate = req.body.publicationDate

        // ...
        // ...
        res.status(204).send(video)
    } else {
        res.sendStatus(404)
    }
})

// params, query, body, headers, method

videoRouters.delete('/:id', (req: Request, res: Response) => {
    const video = videos.find(v => v.id === +req.params.id)
    if(!video) return res.sendStatus(404)
    videos = videos.filter(v => v.id !== video.id)
    return res.sendStatus(204)

    // for (let i = 0; videos.length > i; i++) {
    //     if (videos[i].id === +req.params.id) {
    //         videos.splice(i, 1)
    //         res.sendStatus(204)
    //         return;
    //     } else res.sendStatus(404)
    // }
})

//второй делит по всем видосам

export const deleteRouters = Router({})

deleteRouters.delete('/', (req: Request, res: Response) => {
    videos = []
    res.sendStatus(204)
})
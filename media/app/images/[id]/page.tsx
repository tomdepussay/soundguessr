import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    const filePath = path.join(process.cwd(), 'uploads', 'images', `${id}.`)

    if (!fs.existsSync(filePath)) {
        return res.status(404).end('Image not found')
    }

    res.setHeader('Content-Type', 'image/jpeg')
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
}

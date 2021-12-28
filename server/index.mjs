import express from 'express'
//import * as IPFS from 'ipfs-core'
import { create } from 'ipfs-http-client'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import all from 'it-all'

const app = express()
const ipfs = create()

const assetsDir = process.env.ASSETS_DIR

app.get(/^\/(app\.(j|cs)s)?$/, async (req, res) => {
  let path = `/ipfs/${assetsDir}`
  let contentType = 'text/html'

  if (req.path === '/') {
    path += '/index.html'
  } else {
    path += req.path

    const ext = req.path.split('.')[1]
    if (ext === 'js') {
      contentType = 'text/javascript'
    } else {
      contentType = 'text/css'
    }
  }

  res.setHeader('Content-Type', contentType)

  const data = uint8ArrayConcat(await all(ipfs.cat(path)))
  res.send(uint8ArrayToString(data))
})

const imageMimes = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml'
}

app.get("/images/:file", async (req, res) => {
  const ext = req.params.file.split('.')[1]

  if (ext) {
    const contentType = imageMimes[ext.toLowerCase()]

    if (contentType) {
      try {
        const data = uint8ArrayConcat(await all(ipfs.cat(path)))
        res.setHeader('Content-Type', contentType)
        res.send(uint8ArrayToString(data))
      } catch(e) {
        res.sendStatus(404)
      }
    } else {
      res.sendStatus(404)
    }
  } else {
    res.sendStatus(500)
  }
})

let port = 3000
if (process.env.NODE_ENV === 'production') {
  port = 80
}

app.listen(port, async () => {
  console.log('Fourblock server running on port', port)
})

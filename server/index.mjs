import express from 'express'
import * as IPFS from 'ipfs-core'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import all from 'it-all'

const app = express()
let ipfs;

const assetsDir = 'QmdtGyJftrAfuLD84fxtBb8zgaBevrpmJJYbpbFLLSL5yS'

app.get('*', async (req, res) => {
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

let port = 8080
if (process.env.NODE_ENV === 'production') {
  port = 80
}

app.listen(port, async () => {
  ipfs = await IPFS.create()
  console.log('Fourblock server running on port', port)
})

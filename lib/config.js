// virtualHost est défini seulement si
// l'application tourne dans un container docker
// voir le fichier DockerFile

const virtualHost = process.env.VIRTUAL_HOST
const protocol = virtualHost ? 'https' : 'http'
const port = Number(process.env.PORT)
const url = virtualHost
  ? `${protocol}://${virtualHost}/`
  : `${protocol}://localhost:${port}/`

module.exports = {
  port,
  url,
}

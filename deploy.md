# Déploiement

## Copier les fichiers sources (geojson) sur le serveur

```bash
scp -r sources <user>@<ip>:/srv/tmp/geo-communes-api-sources
```

## Créer un volume Docker pour y copier les sources

Pour créer un volume docker il est nécessaire de créer un container [cf](https://github.com/moby/moby/issues/25245#issuecomment-365980572).

```bash
# créé un container dummy avec l'image Docker busybox auquel on associe le volume
docker container create --name dummy -v geo-communes-api-sources:/vol busybox
# copie les fichiers dans le volume en passant par le container
docker cp geo-communes-api/. dummy:/vol/
# supprime le container
docker rm dummy
```

## Lister les fichiers dans le volume Docker

```bash
# créé un container avec l'image Docker busybox pour inspécter le contenu du volume
docker run -it --rm -v geo-communes-api-sources:/vol busybox ls -l /vol
```

## Environnement de développement

```bash
# démarre l'application dans un conteneurs Docker
# en mode `development`
# accessible à http://localhost:NODE_PORT
docker-compose -f ./docker-compose.localhost.yml up --build
```

### Environnement de test

Pour tester l'application en local dans un environnement de production

Pré-requis:

- une installation locale active de https://github.com/jwilder/nginx-proxy
- un certificat ssl auto-signé
- [instructions](https://medium.com/@francoisromain/set-a-local-web-development-environment-with-custom-urls-and-https-3fbe91d2eaf0)

```bash
# démarre l'application dans un container Docker
# en mode `production`
# accessible à https://api.camino.local
docker-compose -f ./docker-compose.local.yml up --build
```

## Environnement de production

Pré-requis:

- une installation active de https://github.com/jwilder/nginx-proxy
- [instructions](https://medium.com/@francoisromain/host-multiple-websites-with-https-inside-docker-containers-on-a-single-server-18467484ab95)

```bash
# démarre l'application dans un container Docker
# en mode `production`
# accessible à http://api.camino.beta.gouv.fr
docker-compose -f ./docker-compose.prod.yml up -d --build
```

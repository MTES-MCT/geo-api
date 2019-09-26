# Géo Communes API

> Retourne une liste de communes françaises en fonction d'un périmètre géographique.

---

## Technologies

- [Node.js](https://nodejs.org/)
- [Express.js](http://expressjs.com)

---

## Environnement

Pour que l'application fonctionne, sont requis:

- Node.js (v.10 ou plus) et npm
- Les [fichiers sources geoJson](http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2019/geojson/) des périmètres géographiques des régions, départements, communes

---

## Configuration et imports des données

- Importer les fichiers sources dans le dossier `/sources`:
- - `regions-100m.geojson.json`
- - `departements-100m.geojson.json`
- - `communes-100m.geojson.json`
- Renommer le fichier `.env.example` en `.env` et le compléter.

```bash
# installe les dépendances et démarre le service
npm run start
```

---

## Usage

Démarre le service:

```bash
# installe les dépendances
npm i

# lance le serveur
npm run serve

# installe les dépendances et démarre le serveur
npm run start
```

L'API répond à une requête en POST contenant un geoJson et retourne une liste de communes françaises dont le périmètre contient une intersection avec le geoJson.

Exemple de code javascript pour interroger l'API.

```js
const geoCommunesApiUrl = 'http://localhost:1234' // renseigner l'url de l'API

const communesGeojsonGet = geojson =>
  fetch(geoCommunesApiUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(geojson)
  })
    .then(response => response.json())
    .catch(err => {
      console.log('communesGeojsonGet error: ', err)
      return []
    })

communesGeojsonGet(myGeoJson)
```

---

## Licence

Géo communes API

[AGPL 3 ou plus récent](https://spdx.org/licenses/AGPL-3.0-or-later.html)

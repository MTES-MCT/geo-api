# Géo Communes API

> Retourne une liste de communes françaises et/ou de forêts de Guyane en fonction d'un périmètre géographique.

---

## Technologies

- [Node.js](https://nodejs.org/)
- [Express.js](http://expressjs.com)

---

## Environnement

Pour que l'application fonctionne, sont requis:

- Node.js (v.10 ou plus) et npm.
- Le [fichier source des communes](http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/latest/geojson/communes-100m.geojson) des périmètres géographiques des communes.
- Le [fichier source des forêts de Guyane](https://catalogue.geoguyane.fr/geosource/panierDownloadFrontalParametrage?LAYERIDTS=91217) avec la projection ***WGS84 (EPSG 4326) [EPSG:4326]***.

---

## Configuration et imports des données

- Importer le fichier source des communes dans le dossier `/sources`: `communes-100m.geojson`.
- Importer le fichier source des forêts de guyanne dans le dossier `/sources`: `forets-guyane.geojson`.
- Renommer le fichier `.env.example` en `.env` et le compléter.

---

## Usage

```bash
# installe les dépendances et démarre le serveur
npm run start
```

- répond à une requête POST contenant un GeoJSON.
- retourne une liste de communes françaises dont le périmètre contient une intersection avec le GeoJSON.

Exemple de code javascript pour interroger l'API :

```js
const geoCommunesApiUrl = 'http://localhost:1234' // renseigner l'url de l'API

const communesGeojsonGet = (geojson) =>
  fetch(geoCommunesApiUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(geojson),
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log('communesGeojsonGet error: ', err)
      return []
    })

communesGeojsonGet(myGeoJson)
```

---

## Licence

Géo communes API

[AGPL 3 ou plus récent](https://spdx.org/licenses/AGPL-3.0-or-later.html)

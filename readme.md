# Géo API

> Retourne une liste de communes françaises et/ou de forêts de Guyane en fonction d'un périmètre géographique.

---

## Technologies

- [Node.js](https://nodejs.org/)
- [Express.js](http://expressjs.com)

---

## Environnement

Pour que l'application fonctionne, sont requis:

- Node.js (v.10 ou plus) et npm.
- Un [fichier geojson de communes](http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/latest/geojson) des périmètres géographiques des communes.
- Le fichier [forets_onf_973.json](https://catalogue.geoguyane.fr/geosource/panierDownloadFrontalParametrage?LAYERIDTS=91217) des forêts de Guyane (Choisir le format de données `GeoJSON` et la projection `WGS84 (EPSG 4326) [EPSG:4326]`).
- Les fichiers du SDOM du Guyane [zone_0_potentielle_s_973.json](https://catalogue.geoguyane.fr/geosource/panierDownloadFrontalParametrage/b6bc9b5d-fe7f-4fde-9d75-f512e5a33374), [zone_0_s_973.json](https://catalogue.geoguyane.fr/geosource/panierDownloadFrontalParametrage/cacbd740-dbb1-421e-af2d-96c9f0bd9a6d), [zone_1_s_973.json](https://catalogue.geoguyane.fr/geosource/panierDownloadFrontalParametrage/c224cfbe-e24e-418b-ad3f-44c07ee19862) et [zone_2_s_973.json](https://catalogue.geoguyane.fr/geosource/panierDownloadFrontalParametrage/125ffae0-53a5-431e-9568-5213b6643608) (Choisir le format de données `GeoJSON` et la projection `WGS84 (EPSG 4326) [EPSG:4326]`).

---

## Configuration et imports des données

- Importer le fichier des communes dans le dossier `/sources`: `communes.geojson`.
- Importer le fichier des forêts de guyanne dans le dossier `/sources`: `forets_onf_973.json`.
- Importer les fichiers du SDOM dans le dossier `/sources`.
- Renommer le fichier `.env.example` en `.env` et le compléter.

---

## Usage

```bash
# installe les dépendances
npm install

# construit l'application
npm run build

# démarre le serveur
npm run start
```

- répond à une requête POST contenant un GeoJSON.
- retourne une liste de communes et de forêts françaises dont le périmètre contient une intersection avec le GeoJSON.

Exemple de code javascript pour interroger l'API :

```js
const geoApiUrl = 'http://localhost:1234'
const myGeoJson = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [-54.0950602907814, 5.20885569954379],
          [-54.1130169578246, 5.21036597243676],
          [-54.1134002694189, 5.20586546870085],
          [-54.0954347319799, 5.20435517507967],
          [-54.0950602907814, 5.20885569954379]
        ]
      ]
    ]
  }
}

const geoApi = async geojson => {
  try {
    const response = await fetch(geoApiUrl, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geojson)
    })

    return response.json()
  } catch (err) {
    console.error('error: ', err)
  }
}

geoApi(myGeoJson).then(r => console.log(JSON.stringify(r, null, 2)))
```

---

## Licence

Géo communes API

[AGPL 3 ou plus récent](https://spdx.org/licenses/AGPL-3.0-or-later.html)

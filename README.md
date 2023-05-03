# 📌 whereabouts
A Geospatial (GeoJSON) Point Feature API.  
Built with [Deno](https://deno.com/runtime), [Oak](https://oakserver.github.io/oak), and [MongoDB](https://www.mongodb.com).

## Demo
You can try Whereabouts using [this demo](https://whereabouts.labs.archiebiddiscombe.net) which is loaded with the [Ordnance Survey OpenNames](https://osdatahub.os.uk/docs/names/overview) dataset.  
Use the API key `demo-testing` where needed. Please play fair, this demo is for experimental use only.

## API Endpoints

`/`  
Lists the API's capabilities.

`/stats`  
Returns statistics regarding the server and database.

`/features`  
Requests must include a valid API key (`key`). Returns a GeoJSON FeatureCollection consisting of the features aggregated from one of the following geospatial search methods:

- Radius: `radius=lng,lat,distance`  
*A distance value is optional. It must be an integer between 1 and 1000 meters.*

- Bounding Box: `bbox=1,2,3,4`  
*A valid Bounding Box with an area < 1km<sup>2</sup>. Bounding Boxes can be calculated using [bboxfinder.com](http://bboxfinder.com).*

The response of a geospatial search can be further customised using the `filter` query which matches against a feature's `class` property. Only exact matches are supported.

## Getting Started
If you wish to self-host the Whereabouts API Server, the following instructions will help you get started. You'll need Docker to run the server and a MongoDB server to store data.

### Database Setup
The server container connects to the MongoDB instance to store both authentication parameters (API keys) and GeoJSON features in two seperate collections:

#### features
The `features` collection must contain valid GeoJSON features:

```js
{
    type: "Feature",
    properties: {
        fid: "a valid feature identifer",
        name: "the feature name",
        class: "a class for the feature"
    },
    geometry: {
        type: "Point",
        coordinates: [lng, lat]
    }
}
```

The `features` collection must have a geospatial index (`2Dsphere`) on the `coordinates` property to enable MongoDB's geospatial capabilities.

#### authentication
The `authentication` collection holds API keys and whether they should be accepted by the server. Each entry represents a unique API key.

```js
{
    key: "the-key-goes-here",
    enabled: true // or false
}
```

### Deployment
The server image is [published to Docker Hub](https://hub.docker.com/r/abiddiscombe/whereabouts) as `abiddiscombe/whereabouts`.

> The image is currently limited to `arm64` architectures (suitable for Apple M1/M2 or Raspberry Pi 4).
> If there is demand for an `amd64` build, this can be investigated in the future.

The server requires the following environment variables:

- `MONGO_URI`  
A valid connection string to your MongoDB database.  
It will look something like: `mongodb+srv://username:password@mongodb.example.com/databaseName?replicaSet=serverName&tls=true&authMechanism=SCRAM-SHA-1&authSource=admin`.

# Whereabouts API Server
A Geospatial (GeoJSON) Point Feature API with support for radial (up to 1km search distance) and bounding box queries. Built with [Deno](https://deno.com/runtime), [Oak](https://oakserver.github.io/oak), and [MongoDB](https://www.mongodb.com) as a personal introduction to geospatial API development.

## API Endpoints

`/`  
Lists metadata about the API service and its endpoints.

`/features`  
Returns a GeoJSON FeatureCollection consisting of the features matching from one of the following geospatial search methods, supplied as a query parameter.

- Radius: `radius=lng,lat,distance`  
*Specifying a distance is optional, with the default value of 1000 meters. The value must be an integer between 1 and 1000 meters.*

- Bounding Box: `bbox=1,2,3,4`  
*A valid Bounding Box with an area < 1km<sup>2</sup>. Bounding Boxes can be calculated using [bboxfinder.com](http://bboxfinder.com).*

The response of a geospatial search can be further constrained using the `filter` query parameter which matches against a feature's `class` property. Only exact matches are supported.

## Deployment Instructions
You'll need Docker to run the API server, and a MongoDB server to store the point dataset. If you're interested in giving it a go, the [Ordnance Survey Open Names](https://osdatahub.os.uk/docs/names/overview) point-based dataset is a suitable example.

### Database Setup
The server container connects to the MongoDB instance to store GeoJSON features. The `features` collection must contain valid GeoJSON features, and have a valid geospatial index (`2Dsphere`) enabled on the `coordinates` property.

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

### Server Deployment
The server image is [published to Docker Hub](https://hub.docker.com/r/abiddiscombe/whereabouts) as `abiddiscombe/whereabouts`. The server accepts the following environment variables:

- `MONGO_URL`  
A valid connection string to your MongoDB database.  
It will look something like: `mongodb+srv://username:password@mongodb.example.com?replicaSet=serverName&tls=true&authMechanism=SCRAM-SHA-1&authSource=admin`.

- `MONGO_DATABASE`   
the name of a database on the MongoDB server instance. The database must contain the neccessary point features in a collection named `features`.

- `CORS_ORIGIN` (Optional)  
A valid domain by which the server's CORS policy should be whitelisted to (e.g. `example.com`). A value of `*` will enable CORS for all origins. **Not supplying a value will disable CORS.**

- `AUTH_TOKEN` (Optional)  
Accepts a string for use as a password via *bearer token authentication*. The token must have a minimum length of 20 characters. This capability is designed for situations where the server is exposed via an API gateway but still reachable by third-parties. **If a token is not supplied, authentication will be disabled.**
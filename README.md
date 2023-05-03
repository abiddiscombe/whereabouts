# 📌 whereabouts
A Point Feature API which returns valid WGS-84 GeoJSON features.  
Built with [Deno](https://deno.com/runtime), the [Oak](https://oakserver.github.io/oak) HTTP Framework, and MongoDB.

## Demo
You can take whereabouts for a spin using [this demo](https://whereabouts.labs.archiebiddiscombe.net), which is prepared with the OGL [Ordnance Survey OpenNames](https://osdatahub.os.uk/docs/names/overview) dataset. Use the API key `demo-testing` where required. *Please play fair. This is not for production use*.

## API Endpoints

### `/`  
Lists the API server's capabilities.

### `/stats`
Returns statistics regarding the API server and database.

### `/features`
Requests to this endpoint must contain a valid `key` query parameter. Upon authentication, the API returns a GeoJSON FeatureCollection containg features selected based on one of the following search methods:

- Radius: `radius=lng,lat,distance`  
*A distance value is optional. It must be an integer between 1 and 1000 meters.*

- Bounding Box: `bbox=1,2,3,4`  
*A valid Bounding Box with an area less than 1km<sup>2</sup> in size. Bounding Boxes can be calculated using [BBOXFinder.com](http://bboxfinder.com).*

You can filter the response of a geospatial search using the `filter` attribute. A filter must match your input feature's `class` property.

## Getting Started
The API Server connects to a single MongoDB database which handles both the storage of authentication parameters (API keys) and geospatial features. The database must contain the following collections:

### features
The `features` collection must contain valid GeoJSON features, each with the following layout:

```js
{
    type: "Feature",
    properties: {
        fid: "a valid Feature ID",
        name: "the feature name",
        class: "a class for the feature"
    },
    geometry: {
        type: "Point",
        coordinates: [lng, lat]
    }
}
```

The features must have a `2Dindex` enabled on the `coordinates` property to enable MongoDB's geospatial features.

### authentication
The `authentication` collection holds API Keys and whether they should be accepted. Each entry represents a unique API key. Entries must use the following layout:

```js
{
    key: "the key goes here",
    enabled: true // or false
}
```

### Deployment
The API Server can be deployed using Docker with the following environment variable(s):

`MONGO_URI`  
Mandatory. A valid connection string to your MongoDB database, this may need to include authentication and TLS security parameters.
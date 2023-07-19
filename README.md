# Whereabouts API
🗺️📍 A GeoJSON Point Feature API with support for feature queries based on `radial` or `bbox` input.

Built with [Deno](https://deno.com/runtime), [Oak](https://oakserver.github.io/oak), and [MongoDB](https://www.mongodb.com) as an introduction to geospatial API development. Please be advised that I am not actively maintaining this project!

![Screenshot of a Whereabouts API response](media/banner.png)

In this screenshot, the database was populated with Ordnance Survey's [Open Names](https://osdatahub.os.uk/docs/names/overview) POI dataset consisting of >3 million features. The Whereabouts API could query this data and return a result of up-to 1,000 features in less than a second ⚡️.

The Whereabouts API uses [MongoDB](https://www.mongodb.com) to store GeoJSON features as individual documents. Each document can hold a single point feature with the following properties: 
- An `fid` (Feature ID) that is unique to a feature and thus can be used to identify it.
- A feature `name` value which can be any string.
- A `class` value which can be used to filter queries and group features into clusters.

Geospatial capabilities are provided by setting MongoDB's `2Dsphere` index on the `coordinates` property. A user can thus query the data using either a radius (a point and distance around it) or bounding box. The server facilitates request validation and error handling.

## Endpoints

`/`  
Lists metadata about the API and its endpoints.

`/features`  
Returns a GeoJSON FeatureCollection consisting of the features selected from one of the following geospatial search methods:

- 🔵 Radius: `?radius=lng,lat,distance` or `?radius=lng,lat`  
*Specifying a distance is optional with a default value of 1000 meters. The value must be an integer between 1 and 1000 meters.*

- 🟦 Bounding Box: `?bbox=1,2,3,4`  
*A valid Bounding Box with an area < 1km<sup>2</sup>. Bounding Boxes can be calculated using [bboxfinder.com](http://bboxfinder.com).*

The response of a geospatial search can be  constrained using the `&filter=className` query parameter which matches exactly against a feature's `class` property.

## Deployment Instructions
> You'll need Docker to run the API server, and a MongoDB database to store the point dataset.

The server image is [published to Docker Hub](https://hub.docker.com/r/abiddiscombe/whereabouts) as `abiddiscombe/whereabouts`. The image accepts the following environment variables:

- `MONGO_URL`  
A valid connection string to your MongoDB database, something like: `mongodb+srv://uname:pword@example.com`.

- `MONGO_DATABASE`   
The name of the database which contains the point features (in a collection named `features`).

- `CORS_ORIGIN` (Optional)  
**By default, CORS is disabled**. A valid domain can be provided to enable CORS, or alternatively, supply a wildcard `*` to enable CORS for all origins.

- `AUTH_TOKEN` (Optional)  
Accepts a string which will be set as a bearer token, required across all endpoints. The string must have a length of at least 20 characters. This capability is designed for situations where the server is exposed via an API gateway but still reachable on the public internet.

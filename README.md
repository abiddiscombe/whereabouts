# Whereabouts API
A GeoJSON Point Feature API, searchable via `radial` or `bbox` queries with additional feature filtering supported. Whereabouts is built with [Deno](https://deno.com/runtime), the [Hono](https://honojs.dev) web framework, and [MongoDB](https://www.mongodb.com).

![Screenshot of a Whereabouts API response](media/banner.png)

In this screenshot, the database was populated with Ordnance Survey's [Open Names](https://osdatahub.os.uk/docs/names/overview) POI dataset consisting of around 3 million features. The Whereabouts API, using MongoDB's geospatial capabilities, can query this data and return a result of up-to 1,000 features in less than a second. You can try it for yourself using the demo linked to this project.

## API Endpoints

### `/`
[ GET ] Lists metadata about the API and its endpoints.

### `/features`
[ GET ] Returns a GeoJSON FeatureCollection consisting of features matching one of the following search methods:

- **Radius** - `?radius=lng,lat,distance`  
*Specifying a distance (in meters) is optional, the value must be an integer between 1 and 1000. The default distance value is 1000.*

- **Bounding Box** - `?bbox=1,2,3,4`  
*A valid Bounding Box with an area less than 1km<sup>2</sup>. Bounding Boxes can be calculated using [bboxfinder.com](http://bboxfinder.com).*

The response of a feature search can be further constrained by using the `&filter=className` query parameter which matches exactly against each feature's `class` property.

Metadata on the type of query used to return a set of features is provided in the `query` section of the response. A hard-limit of 1000 features can be returned by the API, the client will be notified when then occurs.

## Database Schema
Each GeoJSON point feature is stored as a unique document in MongoDB; documents are stored in a collection named `features`. The properties of the feature much contain the following attribution, but additional key-value pairs can also be added and these will appear in the search results.
- `fid` -  A Feature ID that is unique to a feature and thus can be used to identify it. MongoDB's default `_id` value is not revealed via the API.
- `name` - A name for each feature which can be set to any string. Duplicate names are valid.
- `class` - A classification value which can be used to filter queries further. A class must be a string with no spaces or special characters.

Geospatial capabilities are provided by setting MongoDB's `2Dsphere` index on the `geometry.coordinates` field. The server facilitates request validation and error handling prior to queries reaching the database.

## Deployment Instructions
The server image is [published to Docker Hub](https://hub.docker.com/r/abiddiscombe/whereabouts) as `abiddiscombe/whereabouts`. The image accepts the following environment variables:

- `MONGO_URL` (Mandatory)  
A valid connection string to your MongoDB cluster. It should look like: `mongodb+srv://uname:pword@example.com`.

- `MONGO_DATABASE` (Mandatory)   
The name of the database on the cluster. The database *must* store data in collection named `features` with a valid geospatial index applied.

- `CORS_ORIGIN`  
**CORS is disabled by default**. A valid domain can be provided to enable CORS, or alternatively, supply a wildcard (`*`) to enable CORS for all origins.

- `AUTH_TOKEN`  
A string (with a minimum length of 20 characters) to set as a bearer token to provide a level of basic security. When enabled, authorization will be required on all endpoints.

## Development Instructions
Each release of the Whereabouts API is developed in dedicated branch titled using the target version number (e.g., `dev-0.0.0`).

*As of version 2.1.0, a test suite built on Deno's testing tool is under development. The test suite is still under development and this is not yet at a point suitable for use in automated validation.*

To run the project, use the following task commands.
```bash
deno task dev
deno task test
```

The task entries have the correct permission flags required to run the server, these include access to environment variables, access to the `node_modules` folder, and access to the network (to serve requests and connect to the database). **Don't forget to set the environment variables outlined above!**

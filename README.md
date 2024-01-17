# Whereabouts API
A GeoJSON Point Feature API, searchable via feature name, radius, or bounding box queries with additional class-based feature filtering supported. Whereabouts is built with [Deno](https://deno.com/runtime), the [Hono](https://honojs.dev) web framework, and [MongoDB](https://www.mongodb.com).
> **Service Demo** \
> You can try-out Whereabouts using the demo at [ab-demo-whereabouts-server.nicebay-8db3cc3c.uksouth.azurecontainerapps.io](https://ab-demo-whereabouts-server.nicebay-8db3cc3c.uksouth.azurecontainerapps.io). The demo app is spun-up on demand and thus subject to (~5 sec) cold starts.

![Screenshot of a Whereabouts API response](media/banner.png)

> Response of a geospatial radius query using Ordnance Survey's [Open Names](https://osdatahub.os.uk/docs/names/overview) dataset.

## API Service Endpoints
*API responses are not pretty-printed by default. To format JSON responses from any endpoint, add the `?pretty` query parameter to your request.*

### `/`
**Service Root** \
[ GET ] Returns a list of available service endpoints.

### `/classes`
**Class List** \
[ GET ] Returns a list of dataset classes on which features can be filtered.

### `/features`
**Feature Search** \
[ GET ] Returns GeoJSON features. Supports the following search methods:

- **Geospatial > Radius Query** \
`?radius=lon,lat,distance` \
Accepts a Lon-Lat coordinate pair and a search distance value between 0 and 2000 meters.
    - Results can be filtered by class name using the `&class=className` query parameter.
    - This endpoint will return a maximum of 1000 features per query. The next 1000 features can be retrieved by providing an `&offset=1000` query parameter. The offset value must be a multiple of 1000.

- **Geospatial > Bounding Box Query** \
`?bounds=1,2,3,4` \
Accepts a valid Bounding Box with an area less than 2km<sup>2</sup>.
    - Results can be filtered by class name using the `&class=className` query parameter.
    - This endpoint will return a maximum of 1000 features per query. The next 1000 features can be retrieved by providing an `&offset=1000` query parameter. The offset value must be a multiple of 1000.


- **Textual (Full Text Search) > Name Query** \
`?text=featureName` \
Accepts a partial or full feature name to search by. User input must be between 4 and 20 characters. Outgoing results from MongoDB are subject to secondary filtering via [FuseJS](https://www.fusejs.io/).
    - Searches are case-insensitive and span the entire dataset.
    - Results can be filtered by class name using the `&class=className` query parameter.
    - This endpoint will return a maximum of 1000 features per query. The `offset` parameter is not supported.

### `/metadata`
**Service Metadata** \
[ GET ] Returns metadata about the Whereabouts API service and the source dataset.

The `totalClasses` and `totalFeatures` fields are calculated from the source dataset. The `name`, `license`, `version`, and `documentation` fields are each optional and can be included by passing a single document (with matching key-value pairs) into a `metdata` collection within the MongoDB database.


## Deployment Guide
The Whereabouts API Server is designed to operate as a Bring-Your-Own-Dataset utility. Providing a dataset consists of point GeoJSON features stored in MongoDB in accordance with the specification below, the server should be able to parse it.

### Docker Setup
The server image is [published on Docker Hub](https://hub.docker.com/r/abiddiscombe/whereabouts) as `abiddiscombe/whereabouts`. \
The following environment variables are required:

- `MONGO_URL` \
A valid MongoDB connection string. It should look like: `mongodb+srv://uname:pword@example.com`.

- `MONGO_DATABASE` \
The name of the database to connect to. The database collections must be named `features` and `metadata`.

- `CORS_ORIGIN` \
A valid fully-qualified domain name. Supply a wildcard (`*`) to enable CORS for all origins. Not supplying a value will disable CORS headers.

### Database Schema
The MongoDB database must have a collection named `features` in which each GeoJSON point feature is stored as a unique document. Feature must contain the following properties:

- `name` - A name string for each feature. Duplicate names are permitted.
- `class` - A classification string upon which API responses can be filtered.

MongoDB index fields are required to handle geospatial and full-text search queries; the server will otherwise return an error. Setting an index for `properties.class` is optional, but strongly reccommended because the `distinct` operation is resource-intensive.

- `properties.name` - `text`
- `properties.class` - `regular`
- `geometry.coordinates` - `2Dsphere`


The MongoDB database can also optionally contain a collection named `metadata`. This collection can store a single document containing key-value pairs matching those described in the `/metdata` endpoint instructions.

## Development Notes

The server can be run locally using the following commands. These `task` entries are pre-configured with the correct permission flags, these include access to the system environment and network. Remember to configure your environment variables as per the instructions.

```bash
deno task dev
deno task test
```

FYI: As of version 2.1.0, a endpoint-based test suite is under development. It's not yet at a point suitable for automated use.

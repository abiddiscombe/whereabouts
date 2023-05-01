🚀 *This project is under development!*

# 📌 whereabouts
A GeoJSON Point Feature API. Built with Deno, Oak, and MongoDB.

## Endpoints
Endpoints with a padlock (🔒) require a `key` query parameter to access content.

### `/`  
Lists API server capabilities.

### `/stats` (🔒)  
Returns statistics about the API server and database.

### `/features` (🔒)  
Returns GeoJSON features based on one of the following search methods:
- Radius Search = `?radius=lng,lat,distance`
- Bounding Box Search = `?bounds=1,2,3,4`

## Development To-Dos

- [x] Initital Project Setup
- [x] Endpoint - Root
- [x] Endpoint - Features (bbox, radius)
- [x] Endpoint - Statistics
- [x] Key-Based Auth - Endpoint Protection
- [ ] Key-Based Auth - Key Management
- [ ] Feature Paging
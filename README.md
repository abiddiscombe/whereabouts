# 📌 whereabouts
A GeoJSON Point Feature API. **This project is under development!**

## Endpoints
Endpoints with a padlock (🔒) require a `key` query parameter to access content. If you're interested in having access, reach out!

`/`  
Lists API server capabilities.

`/stats` (🔒)  
Returns statistics about the API server and database.

`/features` (🔒)  
Returns GeoJSON features based on one of the following search methods:
- Radius Search = `?radius=lng,lat,distance`
- Bounding Box Search = `?bounds=1,2,3,4`

## Development To-Dos
This repo will eventually consist of an API server and a frontend UI. Most development effort is placed on the former.  I'm making the repository public to share my development journey.

### API Server
- [x] Initital Project Setup
- [x] Endpoint - Root
- [x] Endpoint - Features (bbox, radius)
- [x] Endpoint - Statistics
- [x] Key-Based Auth - Endpoint Protection
- [ ] Key-Based Auth - Key Management
- [ ] Feature Paging

### Frontend UI (Demo)
- [ ] Initital Project Setup
- [ ] API Statistics
- [ ] Feature Search - Radius
- [ ] Feature Search - Bounding Box
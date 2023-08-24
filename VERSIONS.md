# VERSIONS.md

## Version 2.1.0 (August 2023)
- [X] #FIX HTTP status code mismatches for `/features` validation errors.
- [X] #FIX Prevent a feature's MongoDB `_id` from leaking into JSON response.
- [X] #FIX Bounding Box `query` metadata not returned as array.
- [X] #REFACTOR Reorganize global constants and error messages into a new file.
- [X] #REFACTOR Migrate HTTP framework from [Oak](https://oakserver.github.io/oak) to [Hono](https://honojs.dev).
- [X] #DOCS Rename `CHANGES.md` to `VERSIONS.md` to better describe file contents. File now includes release dates.
- [X] #TEST Partial creation of test suite (for endpoints and utility files).
- [X] #FEAT Total number of matches are now returned in feature search responses.
- [X] #FEAT New `/classes` endpoint created.

## Version 2.0.0 (June 2023)
- [x] #FEAT Migrate CORS capability to a custom middleware component.
- [x] #FEAT Support for custom CORS origin configurations.
- [x] #FEAT Deprecate the built-in API statistics reporting module and endpoint.
- [x] #FEAT Replace key-based authentication with an opt-in bearer-token middleware.
- [x] #REFACTOR Transition to the official NPM MongoDB Client.
- [x] #FIX Introduction of a 1000-feature limit per request with warnings.
- [x] #FEAT Create Not-Found-404 error middleware.
- [x] #REFACTOR Update Code Formatting (`deno fmt`).
- [x] #FEAT Per-Request Console Logging.
- [x] #DOCS Update `README.md` file.
- [x] #DOCS Migrate `changelog.txt` to `CHANGES.md` file.

## Version 1.0.0 (May 2023)
- [x] #FEAT The initial release, with support for geospatial feature queries via radius or bounding box and filtering based on feature class.
- [x] #FEAT Support for key-based authentication.

# whereabouts
A GeoJSON Point Feature API, built on Deno and with MongoDB.

I'm currently building whereabouts from scratch, but I'm making the repository public to share the development journey. I plan to build whereabouts with Deno, the Oak framework, and using MongoDB to store GeoJSON data. As a minimum, whereabouts will have the following capabilities:

- A **Geospatial Search Endpoint** supporting queries based on radius and bounding boxes.
- A **Textual Search Endpoint** supporting queries based on the attribution stored within the GeoJSON.
- Some form of **paging** where more features exist than it is possible to return in a single query.
- **Key-Based Authentication** around endpoints which return data.
- Custom **CORS** configuration options to lock-down use of the API to specific sites or web applications.

It's likely the scope of whereabouts will change as I build it in my spare time outside of work. I'd be interested to hear any suggestions you have for the project! Cheers, Archie.

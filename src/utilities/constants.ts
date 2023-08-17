// constants.ts

export const info = {
    WHEREABOUTS_NAME: 'Whereabouts API',
    WHEREABOUTS_VERSION: '2.1.0',
};

export const errors = {
    // only generic errors are included for now
    HTTP_404: 'Resource not found. Please check your URL.',
    HTTP_500: 'Internal server error. Please try again later.',
};

export const endpointDescs = {
    features: 'Returns GeoJSON features. Supports either bbox or radial search methods.'
}
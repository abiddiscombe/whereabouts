// // cache.ts
// import { info } from "./constants.ts";

// // Some requests to and from the database are very
// // expensive; they take a significant amount of time
// // and compute to execute. To protect resources and
// // lower service costs, a cache is implemented to
// // store responses for a set time period.

// export const cache = {
//     checkState: (id: string) => {
//         const currentTime = Math.floor(Date.now() / 1000);
//         return (cacheItems[id].dob || cacheItems[id].val || cacheItems[id].dob - currentTime < info.WHEREABOUTS_CACHE_LIFETIME)
//             ? true
//             : false
//     },
//     set: (id: string, value: any) => {
//         const currentTime = Math.floor(Date.now() / 1000);
//         cacheItems[id] = {
//             dob: currentTime,
//             value: val,
//         }
//     },
//     get: (id: string) => {
//         return cacheItems[id].val,
//     }
// }

// const cacheItems = {
//     totalFeatures: {
//         dob: 0,
//         val: null
//     },
//     classList: {
//         age: 0,
//         val: null
//     }
// }

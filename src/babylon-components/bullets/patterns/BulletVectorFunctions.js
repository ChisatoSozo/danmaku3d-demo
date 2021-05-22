import { Vector3 } from '@babylonjs/core';
import seedRandom from 'seedrandom';

export function burst(samples, totalRadius, startTheta = 0, thetaLength = 2 * Math.PI, startY = 1, yLength = 2) {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); //golden angle in radians

    for (let i = 0; i < samples; i++) {
        const y = startY - (i / (samples - 1)) * yLength; //y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y); //radius at y

        const theta = (phi * i % thetaLength) + startTheta; //golden angle increment

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        points.push(new Vector3(x, y, z).scale(totalRadius));
    }

    return points;
}

export function stableRandBurst(seed, samples, totalRadius, startTheta = 0, thetaLength = 2 * Math.PI, startY = 1, yLength = 2) {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); //golden angle in radians
    const rng = seedRandom(seed);

    for (let i = 0; i < samples; i++) {
        const y = startY - rng() * yLength; //y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y); //radius at y

        const theta = (phi * i % thetaLength) + startTheta; //golden angle increment

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        points.push(new Vector3(x, y, z).scale(totalRadius));
    }

    return points;
}

// export function randBurst(samples, totalRadius){

//     const points = []
//     const phi = Math.PI * (3. - Math.sqrt(5.))//golden angle in radians

//     for (let i = 0; i < samples; i++){
//         const y = Math.random() * 2 - 1  //y goes from 1 to -1
//         const radius = Math.sqrt(1 - y * y)  //radius at y

//         const theta = phi * i  //golden angle increment

//         const x = Math.cos(theta) * radius
//         const z = Math.sin(theta) * radius

//         points.push(new Vector3(x, y, z).scale(totalRadius))
//     }

//     return points
// }

// export function arc(samples, radius, start, end){

//     start = new RandVector3(...start)
//     end = new RandVector3(...end)
//     const points = []

//     for (let i = 0; i <= samples; i++){
//         let perc = i/samples;
//         let point = Vector3.Lerp( start, end, perc ).normalize().scale(radius);
//         points.push(point);
//     }

//     return points
// }

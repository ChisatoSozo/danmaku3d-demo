import { Constants, RawTexture, Vector2, Vector3 } from '@babylonjs/core';
import { isFunction } from 'lodash';
import nextPowerOfTwo from 'next-power-of-two';
import { v4 } from 'uuid';
import { globals } from '../../components/GlobalsContainer';
import { DIFFICULTY, MAX_BULLETS_PER_GROUP } from '../../utils/Constants';
import { glsl } from '../BabylonUtils';
import { CustomCustomProceduralTexture } from '../CustomCustomProceduralTexture';
import { allBullets, preComputedBulletPatterns } from '../gameLogic/StaticRefs';
import { makeName } from '../hooks/useName';

export const addReducerPixelShader = glsl`
    uniform sampler2D source;
    uniform vec2 sourceResolution;

    void main() {
        vec2 offset = ((gl_FragCoord.xy - vec2(0.5, 0.5)) * 2.) + vec2(0.5, 0.5);

        vec4 outValue = vec4(0., 0., 0., 0.);

        for(float i = 0.; i < 2.; i++){
            for(float j = 0.; j < 2.; j++){
                vec2 curPixel = offset + vec2(i, j);
                vec2 uv = curPixel / sourceResolution;
                outValue += texture2D( source, uv );
            }
        }
        
        gl_FragColor = outValue;
    }
`;

export const bulletReplaceRotationFromPrecompute = (precomputeId, sourceId, optionsToChange = {}) => {
    const newInstruction = { ...allBullets[sourceId].instruciton }

    const { velocities, timings } = preComputedBulletPatterns[precomputeId]
    const positions = allBullets[sourceId].behaviour.diffSystem.positionTextures[0];

    const outInstruction = Object.assign(newInstruction, {
        patternOptions: {
            pattern: 'explicit',
            positions: positions,
            velocities: velocities,
            timings: timings
        },
        soundOptions: {
            sound: 'enemyChangeBullet'
        },
        wait: 0,
    })
    delete outInstruction.endTimings;
    doubleAssign(outInstruction, optionsToChange)
    doubleAssign(outInstruction, {
        behaviourOptions: {
            reliesOnParent: false,
            disableWarning: true
        },
    })

    return outInstruction
}

export const parallelReducer = (source, sourceResolution, scene) => {
    const reducerName = makeName('reducer');
    let reducer = new CustomCustomProceduralTexture(
        reducerName,
        'addReducer',
        sourceResolution / 2,
        scene,
        false,
        false,
        false,
        Constants.TEXTURETYPE_FLOAT
    );
    reducer.setTexture('source', source);
    reducer.setVector2('sourceResolution', new Vector2(sourceResolution, sourceResolution));

    const reducerLayers = [reducer];

    for (let newResolution = sourceResolution / 2; newResolution > 1; newResolution /= 2) {
        const newReducerName = makeName('reducer');
        let newReducer = new CustomCustomProceduralTexture(
            newReducerName,
            'addReducer',
            newResolution / 2,
            scene,
            false,
            false,
            false,
            Constants.TEXTURETYPE_FLOAT
        );
        newReducer.setTexture('source', reducer);
        newReducer.setVector2('sourceResolution', new Vector2(newResolution, newResolution));
        reducer = newReducer;

        if (newResolution > 2) {
            reducerLayers.push(newReducer);
        }
    }

    return [reducer, reducerLayers];
};

export const doubleAssign = (object1, object2) => {
    for (let key in object2) {
        let mergeTarget = {}
        if (key in object1) {
            mergeTarget = object1[key];
        }
        const newValue = object2[key] instanceof Object ?
            Object.assign(mergeTarget, object2[key]) :
            object2[key];
        object1[key] = newValue;
    }
    return object1;
}

export const doubleClone = (object) => {
    const newObject = {};

    for (let key in object) {
        const newValue = object[key] instanceof Object ?
            { ...object[key] } :
            object[key];
        newObject[key] = newValue;
    }

    return newObject;
}

export const prepareBulletInstruction = (instruction) => {

    const defaultInstruction = {
        materialOptions: {
            material: 'fresnel',
        },
        patternOptions: {
            pattern: 'burst',
            num: 100,
            speed: 1,
            radius: 1,
        },
        endTimings: {
            timing: 'lifespan',
        },
        meshOptions: {
            mesh: 'sphere',
            radius: 1,
        },
        behaviourOptions: {
            behaviour: 'linear',
            reliesOnParent: true
        },
        soundOptions: {
            mute: false,
            sound: 'enemyShoot'
        },
        lifespan: 10,
    };

    const newInstruction = isFunction(instruction) ? instruction(DIFFICULTY[globals.difficulty]) : instruction;

    if (!newInstruction) return false;
    doubleAssign(defaultInstruction, newInstruction);

    for (let key in defaultInstruction.patternOptions) {
        if (isFunction(defaultInstruction.patternOptions[key])) {
            defaultInstruction.patternOptions[key] = defaultInstruction.patternOptions[key](DIFFICULTY[globals.difficulty])
        }
    }

    return defaultInstruction;
};



export const makeTextureFromVectors = (vectors, scene, w = 1, fill = -510) => {
    const num = vectors.length;
    const WIDTH = Math.max(nextPowerOfTwo(Math.ceil(Math.sqrt(num))), 2);
    const data = new Float32Array(WIDTH * WIDTH * 4);

    let offset;

    vectors.forEach((vector, i) => {
        offset = i * 4;
        data[offset + 0] = vector.x;
        data[offset + 1] = vector.y;
        data[offset + 2] = vector.z;
        data[offset + 3] = w;
    });

    for (let i = offset / 4 + 1; i < WIDTH * WIDTH; i++) {
        offset = i * 4;
        data[offset + 0] = fill;
        data[offset + 1] = fill;
        data[offset + 2] = fill;
        data[offset + 3] = w;
    }

    return new RawTexture.CreateRGBATexture(
        data,
        WIDTH,
        WIDTH,
        scene,
        false,
        false,
        Constants.TEXTURE_NEAREST_NEAREST,
        Constants.TEXTURETYPE_FLOAT
    );
};

export const makeTextureFromArray = (array, scene, fill = -510) => {
    const num = array.length;
    const WIDTH = Math.max(nextPowerOfTwo(Math.ceil(Math.sqrt(num))), 2);
    const data = new Float32Array(WIDTH * WIDTH * 4);

    let offset;

    array.forEach((num, i) => {
        offset = i * 4;
        data[offset + 0] = fill;
        data[offset + 1] = fill;
        data[offset + 2] = fill;
        data[offset + 3] = num;
    });

    for (let i = offset / 4 + 1; i < WIDTH * WIDTH; i++) {
        offset = i * 4;
        data[offset + 0] = fill;
        data[offset + 1] = fill;
        data[offset + 2] = fill;
        data[offset + 3] = fill;
    }

    return new RawTexture.CreateRGBATexture(
        data,
        WIDTH,
        WIDTH,
        scene,
        false,
        false,
        Constants.TEXTURE_NEAREST_NEAREST,
        Constants.TEXTURETYPE_FLOAT
    );
};

export const makeTextureFromBlank = (num, scene, w = 1, fill = -510, blankFill = 0) => {
    const WIDTH = Math.max(nextPowerOfTwo(Math.ceil(Math.sqrt(num))), 2);
    const data = new Float32Array(WIDTH * WIDTH * 4);

    let offset;

    for (let i = 0; i < num; i++) {
        offset = i * 4;
        data[offset + 0] = blankFill;
        data[offset + 1] = blankFill;
        data[offset + 2] = blankFill;
        data[offset + 3] = w;
    }

    for (let i = offset / 4 + 1; i < WIDTH * WIDTH; i++) {
        offset = i * 4;
        data[offset + 0] = fill;
        data[offset + 1] = fill;
        data[offset + 2] = fill;
        data[offset + 3] = w;
    }

    return new RawTexture.CreateRGBATexture(
        data,
        WIDTH,
        WIDTH,
        scene,
        false,
        false,
        Constants.TEXTURE_NEAREST_NEAREST,
        Constants.TEXTURETYPE_FLOAT
    );
};

export const convertPlayerBulletCollisions = (buffer) => {
    const collisions = [];

    for (let i = 0; i < buffer.length; i += 4) {
        const collisionID = buffer[i + 3];
        if (collisionID !== 0) {
            collisions.push({
                hit: new Vector3(buffer[i], buffer[i + 1], buffer[i + 2]),
                collisionID: collisionID,
            });
        }
    }

    return collisions;
};

export const convertEnemyBulletCollisions = (buffer) => {
    const collisions = [];

    for (let i = 0; i < buffer.length; i += 4) {
        const pointGraze = buffer[i];
        const bombLife = buffer[i + 1];
        const powerSpecial = buffer[i + 2];

        const environmentPlayer = buffer[i + 3];
        const player = Math.floor(environmentPlayer / MAX_BULLETS_PER_GROUP);
        if (pointGraze || bombLife || powerSpecial || player) {
            collisions.push({
                player,
                point: pointGraze % MAX_BULLETS_PER_GROUP,
                graze: Math.floor(pointGraze / MAX_BULLETS_PER_GROUP),
                bomb: bombLife % 1000,
                life: Math.floor(bombLife / 1000),
                power: powerSpecial % 1000,
                Special: Math.floor(powerSpecial / 1000),
            });
        }
    }

    return collisions;
};

export const computeSourceTextures = (pattern, scene) => {
    const outTextures = {};
    if (pattern.positions) {
        outTextures.initialPositions = makeTextureFromVectors(pattern.positions, scene, 1, -510);
    }
    if (pattern.velocities) {
        outTextures.velocities = makeTextureFromVectors(pattern.velocities, scene, 1, 0);
    }
    if (pattern.timings) {
        outTextures.timings = makeTextureFromArray(pattern.timings, scene);
        outTextures.positions = makeTextureFromBlank(pattern.timings.length, scene, 1., -510., -510.)
        outTextures.collisions = makeTextureFromBlank(pattern.timings.length, scene, 0, 0); //No collisions
    }

    return outTextures;
}

export const makeReplaceInstruction = (oldInstruction, overrides) => {

    const sourceUid = oldInstruction.patternOptions.uid;
    const destUid = v4();

    const newInstruction = doubleClone(oldInstruction);
    doubleAssign(newInstruction, {
        patternOptions: {
            pattern: 'replace',
            sourceUid,
            uid: destUid,
        },
        behaviourOptions: {
            reliesOnParent: false,
            disableWarning: true
        },
        endTimings: {
            uid: destUid,
        },
        soundOptions: {
            sound: 'enemyChangeBullet'
        },
    })
    doubleAssign(newInstruction, overrides);
    return newInstruction;
}
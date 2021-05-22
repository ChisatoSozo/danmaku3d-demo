import { fulfilRotateVelocityReplacement, makeRotateVelocityReplacement } from "./RotateVelocity";
import { fulfilRotateSineVelocityReplacement, makeRotateSineVelocityReplacement } from "./RotateVelocitySine";

export const makeReplacePattern = (patternOptions, parent) => {
    let _pattern;
    if (patternOptions.sourceBulletId) {
        _pattern = fulfilReplacePattern(patternOptions, parent);
    }
    else {
        switch (patternOptions.type) {
            case 'rotateVelocity':
                _pattern = makeRotateVelocityReplacement(patternOptions, parent);
                break;
            case 'rotateVelocitySine':
                _pattern = makeRotateSineVelocityReplacement(patternOptions, parent);
                break;
            default:
                throw new Error('unknown replacement type ' + patternOptions.type);
        }
    }

    return _pattern;
}

export const fulfilReplacePattern = (patternOptions, parent) => {

    let _pattern;
    switch (patternOptions.type) {
        case 'rotateVelocity':
            _pattern = fulfilRotateVelocityReplacement(patternOptions, parent);
            break;
        case 'rotateVelocitySine':
            _pattern = fulfilRotateSineVelocityReplacement(patternOptions, parent);
            break;
        default:
            throw new Error('unknown replacement type ' + patternOptions.type);
    }

    return _pattern;
}
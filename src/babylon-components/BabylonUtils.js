import { Matrix, Quaternion, Scalar, Vector3 } from '@babylonjs/core';
import { ARENA_HEIGHT, ARENA_LENGTH, ARENA_WIDTH } from '../utils/Constants';

export class RandVector3 extends Vector3 {
    constructor(x, y, z = 0, normalizeToLength = false) {

        if (x === 'rand') {
            x = Scalar.RandomRange(-1, 1);
        } else if (Array.isArray(x)) {
            x = Scalar.RandomRange(x[0], x[1]);
        }

        if (y === 'rand') {
            y = Scalar.RandomRange(-1, 1);
        } else if (Array.isArray(y)) {
            y = Scalar.RandomRange(y[0], y[1]);
        }

        if (z === 'rand') {
            z = Scalar.RandomRange(-1, 1);
        } else if (Array.isArray(z)) {
            z = Scalar.RandomRange(z[0], z[1]);
        }

        //Weird GLSL bug if this doesn't happen
        if (x === 0) {
            x = 0.000001;
        }
        if (y === 0) {
            y = 0.000001;
        }
        if (z === 0) {
            z = 0.000001;
        }

        super(x, y, z);

        if (normalizeToLength) {
            this.normalize().scaleInPlace(normalizeToLength);
        }
    }
}

export function randScalar(x) {
    x = x || 1;

    if (x === 'rand') {
        x = Scalar.RandomRange(0, 1);
    } else if (Array.isArray(x)) {
        x = Scalar.RandomRange(x[0], x[1]);
    }
    return x;
}

export const normalizePosition = (position) => {
    return position.multiplyByFloats(2 / ARENA_WIDTH, 2 / ARENA_HEIGHT, 2 / ARENA_LENGTH).subtractFromFloats(0, 1, 0);
};

export const unnormalizePosition = (position) => {
    return position.add(new Vector3(0, 1, 0)).multiplyByFloats(ARENA_WIDTH / 2, ARENA_HEIGHT / 2, ARENA_LENGTH / 2);
};

export const randVectorToPosition = (arrayVector) => {
    if (arrayVector instanceof Vector3) {
        return arrayVector;
    }

    const position = new RandVector3(...arrayVector);
    return unnormalizePosition(position);
};

export const glsl = (template, ...args) => {
    let str = '';
    for (let i = 0; i < args.length; i++) {
        str += template[i] + String(args[i]);
    }
    return str + template[template.length - 1];
};

const getLines = (ctx, text, maxWidth) => {
    var words = text.split(' ');
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};

export const textOnCtx = (ctx, text, size, x, y, fill = 'white', stroke = 'black', strokeWidth = 8, centered = false) => {
    ctx.font = `${size * ctx.canvas.height}px tuhu`;
    ctx.textAlign = centered ? 'center' : 'left';

    const lines = centered ? [text] : getLines(ctx, text, (1 - x * 2) * ctx.canvas.width);

    lines.forEach((line, i) => {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(line, x * ctx.canvas.width, y * ctx.canvas.height + i * (size * ctx.canvas.height * 1.1));

        ctx.fillStyle = fill;
        ctx.fillText(line, x * ctx.canvas.width, y * ctx.canvas.height + i * (size * ctx.canvas.height * 1.1));
    });
};

export const arcOnCtx = (ctx, from, to, color = '#FF0000') => {
    ctx.beginPath();
    ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width / 4, Math.PI * 3 / 2 + Math.PI * 2 * from, Math.PI * 3 / 2 + Math.PI * 2 * to);
    ctx.strokeStyle = color;
    ctx.stroke();
};

export const rotateVector = (vec, yaw = 0, pitch = 0, roll = 0) => {
    const rotationQuaternion = Quaternion.RotationYawPitchRoll(yaw, pitch, roll);
    const rotationMatrix = new Matrix();
    rotationQuaternion.toRotationMatrix(rotationMatrix);
    return Vector3.TransformCoordinates(vec, rotationMatrix);
}

export const getRotationMatrix = (transformNode) => {
    const quaternion = transformNode.rotationQuaternion;
    const result = new Matrix();
    quaternion.toRotationMatrix(result);
    return result;
}
import { TransformNode } from "react-babylonjs";
import { AgroThenAfraidMovement } from "./AgroThenAfraidMovement";
import { AppearMoveMovement } from "./AppearMoveMovement";
import { FromToMovement } from "./FromToMovement";
import { RotateMovement } from "./RotateMovement";

export const makeEnemyMovement = (type) => {
    switch (type) {
        case "agroThenAfraid":
            return AgroThenAfraidMovement
        case "fromTo":
            return FromToMovement
        case "appearMove":
            return AppearMoveMovement
        case "rotate":
            return RotateMovement
        case "empty":
            return TransformNode;
        default:
            throw new Error('Unknown enemy movement type: ' + type)
    }
}
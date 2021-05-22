import { DEV_ALWAYS_FULL_POWER } from "../../../utils/Constants";

export const calcPowerClass = (power) => {
    if (DEV_ALWAYS_FULL_POWER) return 3;
    if (power < 10) return 0;
    if (power >= 10 && power < 25) return 1;
    if (power >= 25 && power < 60) return 2;
    if (power >= 60) return 3;
};

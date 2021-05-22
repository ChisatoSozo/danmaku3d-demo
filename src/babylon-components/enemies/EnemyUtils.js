export const makeActionListTimeline = (actionList) => {
    let accumulator = 0;

    actionList.forEach((action) => {
        if (action.wait === undefined) action.wait = 0;
        action.timeline = accumulator;
        accumulator += action.wait;
    });

    return actionList;
};

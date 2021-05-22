import { DefaultFairy } from './DefaultFairy';
import { StrongerStage1Fairy } from './StrongerStage1Fairy';
import { StrongStage1Fairy } from './StrongStage1Fairy';
import { Tumbleweed } from './Tumbleweed';
import { Wriggle1 } from './Wriggle1';
import { Wriggle2 } from './Wriggle2';

/* eslint no-unused-vars: 0 */

const stage1def = () => {
    const map = {
        epochs: [[]],
    };

    map.epochs[0].push({
        type: 'UI',
        action: 'stageStartQuote',
        text: [
            'Stage 1',
            'Where the Fireflies Fly',
            'Are the fireflies brighter than usual, or is it just your imagination? Tonight will be a long night'
        ],
        wait: 7
    })

    for (let i = 0; i < 12; i++) {
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[-1, -0.9], [-0.1, 0.1], [1, 0.9]], [0, 0, 0]),
            wait: .50
        })
    }

    map.epochs[0].push({
        type: 'empty',
        wait: 3
    })

    for (let i = 0; i < 12; i++) {
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[-0.1, 0.1], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: .50
        })
    }

    map.epochs[0].push({
        type: 'empty',
        wait: 3
    })

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongStage1Fairy([-1, 0.5, 1], [1.5, 0, 0]),
        wait: 5
    })

    map.epochs[0].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongerStage1Fairy([1, 0.5, 1], [-1.5, 0.5, 0]),
        wait: 5
    })

    for (let i = 0; i < 12; i++) {
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: .50
        })
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: .250
        })
    }

    for (let i = 0; i < 12; i++) {
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: Tumbleweed([[-1.3, -1.1], [-0.3, -0.1], [1, 0.9]], [[1.3, 1.1], [-0.3, -0.1], [1, 0.9]]),
            wait: .1
        })
        map.epochs[0].push({
            type: "enemies",
            action: 'spawn',
            enemy: Tumbleweed([[1.3, 1.1], [0.1, 0.3], [1, 0.9]], [[-1.3, -1.1], [0.1, 0.3], [1, 0.9]]),
            wait: .1
        })
    }

    map.epochs[0].push({
        type: "enemies",
        action: 'nextEpoch',
        wait: 0
    })

    map.epochs.push([]);

    map.epochs[1].push({
        type: "enemies",
        action: 'spawn',
        enemy: Wriggle1(),
        wait: 2
    })

    map.epochs[1].push({
        type: "enemies",
        action: 'nextEpoch',
        wait: 0
    })

    map.epochs.push([]);

    map.epochs[2].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongStage1Fairy([-1, 0.5, 1], [1, 0, 0]),
        wait: 0
    })

    map.epochs[2].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongStage1Fairy([1, -0.5, 1], [-1, 0, 0]),
        wait: 3
    })

    for (let i = 0; i < 20; i++) {
        map.epochs[2].push({
            type: "enemies",
            action: 'spawn',
            enemy: DefaultFairy([[-1, 1], [-1, 1], [1, 0.9]], [0, 0, 0]),
            wait: .1
        })
    }

    map.epochs[2].push({
        type: 'empty',
        wait: 3
    })

    map.epochs[2].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongerStage1Fairy([1, 0, 1], [-1, 0, 0]),
        wait: 0
    })
    map.epochs[2].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongerStage1Fairy([-1, 0, 1], [-1, 0, 0]),
        wait: 0
    })

    map.epochs[2].push({
        type: 'empty',
        wait: 2
    })

    for (let i = 0; i < 15; i++) {
        map.epochs[2].push({
            type: "enemies",
            action: 'spawn',
            enemy: Tumbleweed([[-1.3, -1.1], [-0.3, -0.1], [1, 0.9]], [[1.3, 1.1], [-0.3, -0.1], [1, 0.9]]),
            wait: .1
        })
        map.epochs[2].push({
            type: "enemies",
            action: 'spawn',
            enemy: Tumbleweed([[1.3, 1.1], [0.1, 0.3], [1, 0.9]], [[-1.3, -1.1], [0.1, 0.3], [1, 0.9]]),
            wait: .1
        })
    }

    map.epochs[2].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongStage1Fairy([1, 0.5, 1], [-1, 0.5, 0]),
        wait: 0
    })

    map.epochs[2].push({
        type: "enemies",
        action: 'spawn',
        enemy: StrongerStage1Fairy([-1, -0.5, 1], [-1, -0.5, 0]),
        wait: 6
    })

    map.epochs[2].push({
        type: "enemies",
        action: 'nextEpoch',
        wait: 0
    })

    map.epochs.push([]);

    map.epochs[3].push({
        type: "enemies",
        action: 'spawn',
        enemy: Wriggle2(),
        wait: 3
    })

    map.epochs[3].push({
        type: 'UI',
        action: 'init',
        actors: ["player", "wriggle"],
        text: "Oh hey there!"
    })

    map.epochs[3].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "excited",
        text: "Hello ^-^, and what might you be doing out on a night like this?"
    })

    map.epochs[3].push({
        type: 'UI',
        action: 'talk',
        actor: "player",
        emotion: "neutral",
        text: "Well you see I'm just enjoying this cool new extra dimension"
    })

    map.epochs[3].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "tired",
        text: "Yea, up is a pretty neat direction, how do you think the developer managed all this in a browser?"
    })
    map.epochs[3].push({
        type: 'UI',
        action: 'talk',
        actor: "player",
        emotion: "excited",
        text: "Probably some pretty wild compute shaders"
    })

    map.epochs[3].push({
        type: 'UI',
        action: 'talk',
        actor: "player",
        emotion: "neutral",
        text: "Anyways, let's show off what this engine can really do"
    })

    map.epochs[3].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "excited",
        text: "Heck ya!"
    })

    map.epochs[3].push({
        type: 'UI',
        action: 'nextEpoch',
    })

    map.epochs.push([]);

    map.epochs[4].push({
        type: "UI",
        action: 'globalCallback',
        callback: 'bossStart'
    })


    return map;
};

export default stage1def;

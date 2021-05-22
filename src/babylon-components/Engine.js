import {
    Engine,
    Observable
} from '@babylonjs/core';
import React from 'react';
import { EngineCanvasContext } from 'react-babylonjs';



class ReactBabylonjsEngine extends React.Component {
    constructor(props) {
        super(props);
        this.onBeforeRenderLoopObservable = new Observable();
        this.onEndRenderLoopObservable = new Observable();

        this.state = {
            canRender: false
        };
    }

    componentDidMount() {
        const context = this.canvas.getContext('webgl2', { stencil: true });

        this.engine = new Engine(
            context,
            this.props.antialias === true ? true : false, // default false
            { stencil: true },
            this.props.adaptToDeviceRatio === true ? true : false // default false
        )

        this.engine.runRenderLoop(() => {
            if (this.onBeforeRenderLoopObservable.hasObservers()) {
                this.onBeforeRenderLoopObservable.notifyObservers(this.engine);
            }
            this.engine.scenes.forEach(scene => {
                scene.render()
            })
            if (this.onEndRenderLoopObservable.hasObservers()) {
                this.onEndRenderLoopObservable.notifyObservers(this.engine);
            }
        })

        this.engine.onContextLostObservable.add((eventData) => {
            console.warn('context loss observable from Engine: ', eventData);
        })

        window.addEventListener('resize', this.onResizeWindow)

        this.setState({ canRender: true });
    }

    onCanvasRef = (c) => {
        // We are not using the react.createPortal(...), as it adds a ReactDOM dependency, but also
        // it was not flowing the context through to HOCs properly.
        if (this.props.portalCanvas) {
            this.canvas = document.getElementById('portal-canvas')
            console.error('set canvas', this.canvas);
        } else {
            if (c) { // null when called from unmountComponent()
                // c.addEventListener('mouseover', this.focus)
                // c.addEventListener('mouseout', this.blur)
                this.canvas = c
            }
        }
        // console.error('onCanvas:', c); // trying to diagnose why HMR keep rebuilding entire Scene!  Look at ProxyComponent v4.
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResizeWindow);

        if (this.engine !== null) {
            this.engine.dispose();
            this.engine = null;
        }
    }

    render() {
        if (this.state.canRender === false && (this.props.noSSR !== undefined && this.props.noSSR !== false)) {
            if (typeof this.props.noSSR === 'boolean') {
                return null;
            }
            return this.props.noSSR;
        }

        let { touchActionNone, width, height, canvasStyle, canvasId } = this.props

        let opts = {}

        if (touchActionNone !== false) {
            opts['touch-action'] = 'none';
        }

        if (width !== undefined && height !== undefined) {
            opts.width = width
            opts.height = height
        }

        if (canvasId) {
            opts.id = canvasId;
        }

        if (canvasStyle) {
            opts.style = canvasStyle;
        }

        // TODO: this.props.portalCanvas does not need to render a canvas.
        return <EngineCanvasContext.Provider value={{ engine: this.engine, canvas: this.canvas }}>
            <canvas className="game-canvas" {...opts} ref={this.onCanvasRef}>
                {this.engine !== null &&
                    this.props.children
                }
            </canvas>
        </EngineCanvasContext.Provider>
    }

    onResizeWindow = () => {
        if (this.engine) {
            this.engine.resize()
        }
    }
}

export default ReactBabylonjsEngine
import type { Config } from '@redux-devtools/extension';
import { Store } from './types';

// See: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/examples/react-counter-messaging/components/Counter.js

const DefaultActionType: string = 'anonymous';

export interface DevToolsOptions extends Config {
    enabled?: boolean;
    defaultActionType?: string;
}

export function withDevTools<
    S,
    A extends Record<string, unknown> = {},
    C extends Record<string, unknown> = {}
>(store: Store<S, A, C>, { enabled, defaultActionType, ...config }: DevToolsOptions = {}): Store<S, A, C> {
    if (enabled === false) {
        return store;
    }

    const extensionConnector = window.__REDUX_DEVTOOLS_EXTENSION__;
    if (!extensionConnector) {
        console.warn('Please install/enable Redux devtools extension');
        return store;
    }

    const devTools = extensionConnector.connect(config);

    let isInited = false;
    let isRecording = false;
    let initialState!: S;

    store.debug((state, prevState, action) => {
        if (isRecording) {
            return;
        }

        if (!isInited) {
            isInited = true;
            initialState = state;
            devTools.init(state);
            return;
        }

        const type = action ?? defaultActionType ?? DefaultActionType;
        devTools.send({ type }, state);
    }, true);

    // FIXME https://github.com/reduxjs/redux-devtools/issues/1097
    (devTools as any).subscribe((message: any) => {
        if (message.type === 'DISPATCH') {
            isRecording = true;

            const state = message.state ? JSON.parse(message.state) : initialState;
            store.setState(state);

            isRecording = false;
        }
    });

    return store;
}

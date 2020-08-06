import React from 'react';

import {Modal} from "./Modal";
import {Children} from "./Children";

class AppModalRenderPropChildren extends React.PureComponent {
    render() {
        return (
            <Modal>
                {() => <Children />}
            </Modal>
        )
    }
}

class AppModalChildren extends React.PureComponent {
    render() {
        return (
            <Modal>
                <Children />
            </Modal>
        )
    }
}

class AppChildren extends React.PureComponent {
    render() {
        return (
            <Children />
        )
    }
}

export { AppModalChildren, AppModalRenderPropChildren, AppChildren }

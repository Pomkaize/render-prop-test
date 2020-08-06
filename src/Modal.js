import React from 'react';

class Modal extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        if (typeof window === 'undefined') {
            return null;
        }

        const { children } = this.props;
        // по аналогии с vertis-react
        const renderChildren = typeof children === 'function' ? children() : children;

        return (
            <div className="Modal">
                {renderChildren}
            </div>
        )
    }
}

export { Modal }

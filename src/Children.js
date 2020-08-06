import React from 'react';

class Children extends React.PureComponent {
    constructor(props) {
        super(props);

        console.log("Hello, i am creating now");
    }
    render() {
        console.log("Hello, i am rendering now");

        return (
            <div className="ChildrenContent">
                <h1>Hello world</h1>
            </div>
        );
    }
}
export { Children };

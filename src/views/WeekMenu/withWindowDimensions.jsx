import React, { Component } from "react";

export default function withWindowDimensions(WrappedComponent) {
    return class extends Component {
        state = { width: 0 };

        componentDidMount() {
            this.updateWindowDimensions();
            window.addEventListener("resize", this.updateWindowDimensions);
        }

        componentWillUnmount() {
            window.removeEventListener("resize", this.updateWindowDimensions);
        }

        updateWindowDimensions = () => {
            this.setState({ width: window.innerWidth });
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    windowWidth={this.state.width}
                />
            );
        }
    };
}
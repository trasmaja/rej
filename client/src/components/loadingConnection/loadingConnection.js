import './loadingConnection.css';
import React from 'react';
import { Circles } from 'svg-loaders-react'

class LoadingConnection extends React.Component {
    render() {
        return (
            <div className="wrapper-loading">
                <div className="loading-icon">
                    <Circles width="100%" height="100%" />
                    <h1 className="loading-text">Loading...</h1>
                </div>
            </div>
        );
    }
}

export default LoadingConnection;

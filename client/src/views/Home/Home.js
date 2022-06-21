import './Home.css';
import React from 'react';

class Home extends React.Component {
    render() {
        console.log(this.props)
        return (
            <div className="Home">
                <h1>Player</h1>
                <h1>Turn: {this.props.turn}</h1>
                <h1>Year: {this.props.year}</h1>
            </div>
        );
    }
}

export default Home;

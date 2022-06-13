import './Admin.css';
import React from 'react';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = { turn: undefined, year: undefined };
      }

    nextTurn() {
        console.log("next turn")
        this.props.socket.emit("nextTurn", {})
        
    }

    render() {
        // console.log(this.props)
        return (
            <div className="Admin">
                <h1>Admin</h1>
                <h1>Turn: {this.props.turn}</h1>
                <h1>Year: {this.props.year}</h1>

                <button onClick={() => this.nextTurn()}>Next Turn</button>
            </div>
        );
    }
}

export default Admin;

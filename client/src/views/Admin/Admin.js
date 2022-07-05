import './Admin.css';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

export default function Admin(props) {
    console.log(props)

    const [gameState, setGameState] = useState(null);

    useEffect(() => {
        props.socket.emit("getState");
    });

    useEffect(() => {
        props.socket.on("gameState", gameState => {
            setGameState(gameState)
        });
    
        return () => {
            props.socket.off("gameState");
        }
    })

    return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Admin</h2>
            <p>{gameState}</p>
            <button onClick={() => props.socket.emit("endTurn")}>end turn</button>
            <button onClick={() => props.socket.emit("startTurn")}>Start turn</button>
        </main>
    );
}

Admin.propTypes = {
    socket: PropTypes.object.isRequired
}


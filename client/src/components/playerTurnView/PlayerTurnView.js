import './PlayerTurnView.css';
import React from 'react';

class PlayerTurnView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            turnData: [undefined, undefined],
            year: undefined,
        }
    }

    componentDidMount() {
        const { socket, data } = this.props;
        socket.emit("getTurn");
        socket.on("getTurnResponse", turnData => {
            this.setState({ turnData: turnData });
        })
    }

    onDecisionSelect(decision) {
        const { socket, sectorSelection } = this.props;
        socket.emit("tmpSelection", { sector: sectorSelection, decision: decision });
        console.log("howdy")
        console.log(sectorSelection)
    }

    render() {
        const { sectorSelection, data } = this.props;
        const { turnData } = this.state;
        console.log("#####")
        console.log(this.props)
        const decisionsData = data[sectorSelection]
        const decisions = Object.keys(decisionsData).map(key => {
            console.log(decisionsData[key])
            const data = decisionsData[key]
            return (
                <div key={key} className="decision-button" onClick={() => this.onDecisionSelect(key)}>
                    <div className="decision-button-inner">
                        <h2>{data["Namn"]}</h2>
                        <p>{data["Description"]}</p>
                    </div>
                </div>)
        })
        return (
            <div className="wrapper-loading">
                <h1>Your playing as {sectorSelection}</h1>
                <h2>Turn: {turnData[0]}, Year: {turnData[1]}</h2>
                {decisions}
                <pre>{
                    JSON.stringify(this.props.meta, null, 2)
                }</pre>
            </div>
        );
    }
}

export default PlayerTurnView;

import './Home.css';
import React from 'react';
import LoadingConnection from '../../components/loadingConnection/loadingConnection';
import SectorSelection from '../../components/sectorSelection/sectorSelection';
import PlayerTurnView from '../../components/playerTurnView/PlayerTurnView';
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            sectorSelection: undefined,
            meta: undefined,
        };
    }

    componentDidMount() {
        this.props.socket.emit("getGameData");
        this.props.socket.on("getGameDataResponse", (data) => {
            console.log(data);
            setTimeout(() => {
                this.setState({ data: data.gameData, meta: data.metaData });         
            }, 1000);
        });
    }

    onSectorSelect(sector) {
        this.props.socket.emit("playerSelectedSector", sector);
        this.setState({sectorSelection: sector});
    }

    render() {
        // console.log(this.props)
        let mainComponent;
        if (this.state.data === undefined) {
            mainComponent = <LoadingConnection />;
        } else if (this.state.sectorSelection === undefined) {
            mainComponent = <SectorSelection data={this.state.data} onSectorSelect={this.onSectorSelect.bind(this)} />;
        }
        else {
            mainComponent = <PlayerTurnView socket={this.props.socket} data={this.state.data} sectorSelection={this.state.sectorSelection} meta={this.state.meta}/>;
        }

        return (
            <div className="Home">
                {mainComponent}
            </div>
        );
    }
}

export default Home;

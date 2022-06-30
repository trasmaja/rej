import './sectorSelection.css';
import React from 'react';

class SectorSelection extends React.Component {
    render() {
        const { data, onSectorSelect } = this.props;
        console.log("props")
        console.log(this.props)
        let sectorButtons;
        if (data) {
            sectorButtons = Object.keys(data).map(key => {
                console.log(key);
                return (
                    <div key={key} className="sector-button" onClick={() => onSectorSelect(key)}>
                        <div className="sector-button-inner">
                            <h2>{key}</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tincidunt lacus sit amet nibh viverra, dictum pretium dolor pharetra. Nullam eu purus rhoncus, tincidunt libero nec, mollis ipsum. Vivamus congue luctus porta.</p>
                        </div>
                    </div>)
            })
        }
        console.log(sectorButtons)

        return (
            <div className="wrapper-sector-selection">
                <h1 className="sector-selection-header"> What sector do you wanna play as?</h1>
                <div className="sector-selection-buttons">
                    {sectorButtons}
                </div>
            </div>
        );
    }
}

export default SectorSelection;

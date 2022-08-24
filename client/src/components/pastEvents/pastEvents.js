import './pastEvents.css';
import PropTypes from 'prop-types';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const PastEvents = (props) => {
    const { turn } = props;
    const [value, setValue] = React.useState(turn);
    const text = ["Lorem ipsum dolar sit amet", "Praesent condimentum sagittis", "Orci varius natoque", "Lorem ipsum dolar sit amet", "Praesent condimentum sagittis"]
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="wrapper-PastEvents">
            <h3>Tidigare händelser</h3>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
                <Tab label="2025" disabled={!(turn >= 0)}/>
                <Tab label="2030" disabled={!(turn >= 1)}/>
                <Tab label="2035" disabled={!(turn >= 2)}/>
                <Tab label="2040" disabled={!(turn >= 3)} />
                <Tab label="2045" disabled={!(turn >= 4)} />
            </Tabs>
            <div className="wrapper-PastEvents-content">
                <p><b>Indsutri:</b> {text[value]}</p>
                <p><b>Policy:</b> {text[value]}</p>
                <p><b>Nätbolag:</b> {text[value]}</p>
            </div>
        </div>
    );
}

PastEvents.propTypes = {
    // title: PropTypes.string.isRequired
    // socket: PropTypes.object.isRequired
}

export default PastEvents;

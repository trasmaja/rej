import './pastEvents.css';
import PropTypes from 'prop-types';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const PastEvents = (props) => {
    const [value, setValue] = React.useState(2);
    const text = ["Lorem ipsum dolar sit amet", "Praesent condimentum sagittis", "Orci varius natoque"]
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
                <Tab label="2025" />
                <Tab label="2030" />
                <Tab label="2035" />
                <Tab label="2040" disabled />
                <Tab label="2045" disabled />
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

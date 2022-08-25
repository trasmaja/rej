import './timeline.css';
import * as React from 'react';
import PropTypes from 'prop-types';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


const TimeLine = (props) => {
    const { sectorName, turns, turn } = props;
    return (
        <div className="wrapper-timeline">
            <div className="wrapper-timeline-title">
                <h2>{sectorName}</h2>
            </div>
            <div className="wrapper-timeline-timeline">
                <Stepper activeStep={turn} alternativeLabel>
                    {turns.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
        </div>
    );
}

TimeLine.propTypes = {
    sectorName: PropTypes.string.isRequired,
    turns: PropTypes.array.isRequired,
    turn: PropTypes.node.isRequired,
}

export default TimeLine;

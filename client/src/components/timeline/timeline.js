import './timeline.css';
import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['2025', '2030', '2035', '2040', '2045'];

const TimeLine = (props) => {
    const activeStep = 2//Math.floor(Math.random()* steps.length);
    return (
        <div className="wrapper-timeline">
            <div className="wrapper-timeline-title">
                <h2>{props.sectorName}</h2>
            </div>
            <div className="wrapper-timeline-timeline">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => {
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
    sectorName: PropTypes.string.isRequired
}

export default TimeLine;

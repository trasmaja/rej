import './adminTimeline.css';
import * as React from 'react';
import PropTypes from 'prop-types';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


const AdminTimeline = (props) => {
    return (
        <div className="wrapper-timeline" >
            <div className="wrapper-timeline-timeline" style={{marginTop: 15}}>
                <Stepper activeStep={props.turn} alternativeLabel>
                    {props.turns.map((label, index) => {
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

AdminTimeline.propTypes = {
}

export default AdminTimeline;

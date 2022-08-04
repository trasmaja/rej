import './totalEmissionChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import {Area, AreaChart, LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Legend, Label } from 'recharts';

const TotalEmissionChart = (props) => {
    const { propData, dataKey, progKey, domain } = props;
    const data = [{ turn: '2022', co2: null, prog: 100, co2Trans: null, }, { turn: '2025', co2: null, prog: 80, co2Trans: null, }, { turn: '2030', co2: null, prog: 60, co2Trans: null, }, { turn: '2035', co2: null, prog: 40, co2Trans: null, }, { turn: '2040', co2: null, prog: 20, co2Trans: null, }, { turn: '2045', co2: null, prog: 0, co2Trans: null }];
    propData.forEach((element, index) => {
        // console.log(index, element)
        if (element != null) {
            if (element.ind_emissions != null) {
                data[index].co2 = Math.floor(element.ind_emissions * 100);
            }
            if (element.transportation_emissions != null) {
                data[index].co2Trans = Math.floor(element.transportation_emissions * 100);
            }
        }
    });
    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis tickMargin={10} dataKey="turn" />
                    <YAxis width={5} tick={false} domain={['dataMin', 'dataMax']} />
                    {/* <Line dot={false} type="linear" dataKey={"prog"} stroke="#ccc" strokeWidth={3} strokeDasharray="3 3" /> */}
                    <Area name="Transportsektorn" stackId={1} strokeWidth={3} stroke="#0094A3" fill="#0094A3" dataKey={"co2Trans"} />
                    <Area name="Industrisektorn"stackId={1} strokeWidth={3} stroke="#EC6161" fill="#EC6161" dataKey={"co2"} />
                    <Legend />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

TotalEmissionChart.propTypes = {
    title: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
    progKey: PropTypes.string.isRequired,
    domain: PropTypes.array.isRequired,
    // socket: PropTypes.object.isRequired
}

export default TotalEmissionChart;

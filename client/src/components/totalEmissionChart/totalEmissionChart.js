import './totalEmissionChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { Line, Area, ComposedChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const TotalEmissionChart = (props) => {
    const { propData, title } = props;
    const data = [{ turn: '2022', co2: null, prog: 25, co2Trans: null, }, { turn: '2025', co2: null, prog: 20, co2Trans: null, }, { turn: '2030', co2: null, prog: 15, co2Trans: null, }, { turn: '2035', co2: null, prog: 10, co2Trans: null, }, { turn: '2040', co2: null, prog: 5, co2Trans: null, }, { turn: '2045', co2: null, prog: 0, co2Trans: null }];

    propData.forEach((element, index) => {
        if (element != null) {
            if (element.emissions_ind != null) {
                data[index].co2 = Math.floor(element.emissions_ind);
            }
            if (element.emissions_transport != null) {
                data[index].co2Trans = Math.floor(element.emissions_transport);
            }
        }
    });

    return (
        <div className="wrapper-lineChart">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis strokeWidth={1} stroke="#666" tickMargin={10} dataKey="turn" />
                    <YAxis strokeWidth={1} stroke="#666" width={5} tickCount={7} domain={[0, datamax => datamax + 5]} />
                    <Line dot={false} name="Prognos" legendType="none"
                        tooltipType="none" type="linear" dataKey={"prog"} stroke="#ccc" strokeWidth={2} strokeDasharray="4 4" />
                    <Area dot={true} name="Transportsektorn" stackId={1} strokeWidth={2} stroke="#0094A3" fill="#0094A3" dataKey={"co2Trans"} />
                    <Area dot={true} name="Industrisektorn" stackId={1} strokeWidth={2} stroke="#EC6161" fill="#EC6161" dataKey={"co2"} />
                    <Legend />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

TotalEmissionChart.propTypes = {
    title: PropTypes.string.isRequired,
    propData: PropTypes.array.isRequired,
}

export default TotalEmissionChart;

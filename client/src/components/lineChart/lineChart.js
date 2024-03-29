import './lineChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const LineChartComp = (props) => {
    const { propData, title, dataKey } = props;
    const data = [{ turn: '2022', co2: null, prog: 15, totalCo2: null, }, { turn: '2025', co2: null, prog: 12, totalCo2: null, }, { turn: '2030', co2: null, prog: 9, totalCo2: null, }, { turn: '2035', co2: null, prog: 6, totalCo2: null, }, { turn: '2040', co2: null, prog: 3, totalCo2: null, }, { turn: '2045', co2: null, prog: 0, totalCo2: null }];
    propData.forEach((element, index) => {
        if (element != null) {
            if (element.emissions_ind != null) {
                data[index].co2 = Math.floor(element.emissions_ind);
            }
            if (element.total_emissions != null) {
                data[index].totalCo2 = Math.floor(element.total_emissions * 100);
            }
        }
    });
    return (
        <div className="wrapper-lineChart">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis stroke="#999" strokeWidth={1} tickMargin={10} dataKey="turn" />
                    <YAxis stroke="#999" strokeWidth={1} width={5} tickCount={5} domain={[0, datamax => datamax + 5]} />
                    <Line dot={false} type="linear" dataKey={"prog"} stroke="#999" strokeWidth={2} strokeDasharray="4 4" />
                    <Line type="linear" strokeWidth={2} stroke="#2B3B55" dataKey={dataKey} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

LineChartComp.propTypes = {
    propData: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
}

export default LineChartComp;

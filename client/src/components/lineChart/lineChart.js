import './lineChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const LineChartComp = (props) => {
    const { propData, title, dataKey } = props;
    const data = [{ turn: '2022', co2: null, prog: 100, totalCo2: null, }, { turn: '2025', co2: null, prog: 80, totalCo2: null, }, { turn: '2030', co2: null, prog: 60, totalCo2: null, }, { turn: '2035', co2: null, prog: 40, totalCo2: null, }, { turn: '2040', co2: null, prog: 20, totalCo2: null, }, { turn: '2045', co2: null, prog: 0, totalCo2: null }];
    propData.forEach((element, index) => {
        if (element != null) {
            if (element.ind_emissions != null) {
                data[index].co2 = Math.floor(element.ind_emissions * 100);
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
                    <XAxis tickMargin={10} dataKey="turn" />
                    <YAxis width={5} tickCount={2} domain={['dataMin', 'dataMax']} />
                    <Line dot={false} type="linear" dataKey={"prog"} stroke="#ccc" strokeWidth={3} strokeDasharray="3 3" />
                    <Line type="linear" strokeWidth={3} stroke="#2AA784" dataKey={dataKey} />
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

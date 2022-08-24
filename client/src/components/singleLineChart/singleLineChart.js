import './singleLineChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const SingleLineChart = (props) => {
    const { propData, dataKey, progKey, domain } = props;
    const data = [{ turn: '2022', value: null }, { turn: '2025', value: null }, { turn: '2030', value: null }, { turn: '2035', value: null }, { turn: '2040', value: null }, { turn: '2045', value: null }];
    propData.forEach((element, index) => {
        // console.log(index, element)
        if (element != null) {
            if (element[dataKey] != null) {
                data[index].value = element[dataKey];
            }
        }
    });
    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis tickMargin={10} stroke="#484D52" dataKey="turn" />
                    <YAxis stroke="#484D52" width={5} domain={domain} tick={props.tick} tickCount={2} />
                    <Line type="linear" strokeWidth={3} stroke="#2AA784" dataKey={"value"} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

SingleLineChart.propTypes = {
    title: PropTypes.string.isRequired,
    domain: PropTypes.array.isRequired,
    tick: PropTypes.bool.isRequired,
    // socket: PropTypes.object.isRequired
}

export default SingleLineChart;

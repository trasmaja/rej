import './EBITChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

let max = null;
let min = null;

const EBITChart = (props) => {
    const { propData, title } = props;
    const data = [{ turn: '2022', ebit: null }, { turn: '2025', ebit: null }, { turn: '2030', ebit: null }, { turn: '2035', ebit: null }, { turn: '2040', ebit: null }, { turn: '2045', ebit: null }];

    propData.forEach((element, index) => {
        if (element != null) {
            if (element.ind_EBIT_margin != null) {
                const value = Math.floor(element.ind_EBIT_margin * 100);
                data[index].ebit = value;
                if(max === null) {
                    max = value;
                }
                if(min === null) {
                    min = value;
                }
                if(value > max) {
                    max = value;
                }
                if(value < min) {
                    min = value;
                }
            }
        }
    });

    let test = [-60, -50, -40, -30, -25, -20, -15, -10, -5, 5, 15, 20, 25, 30, 40, 50, 60]
    test = test.filter(value =>  (value+5 > min && value-5 < max))

    return (
        <div className="wrapper-lineChart">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <CartesianGrid strokeWidth={1} stroke="#ccc" />
                    <XAxis stroke="#999" strokeWidth={1} tickMargin={10} dataKey="turn" />
                    <YAxis ticks={test} stroke="#999" strokeWidth={1} width={5}  domain={[datamin => (datamin - 5 > -5 ? -5 : datamin - 5), datamax => (datamax + 5)]} />
                    <ReferenceLine y={0} strokeWidth={2} stroke="#EC6161" strokeDasharray="5 5">
                        <Label fill='#EC6161' value="0" position="left" />
                    </ReferenceLine>
                    <ReferenceLine y={10} strokeWidth={2} stroke="#58B998" strokeDasharray="5 5" >
                        <Label fill='#58B998' value="10" position="left" />
                    </ReferenceLine>
                    <Line type="lienar" strokeWidth={2} stroke="#2B3B55" dataKey={"ebit"} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

EBITChart.propTypes = {
    title: PropTypes.string.isRequired,
    propData: PropTypes.array.isRequired,
}

export default EBITChart;

import './lineChart.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const LineChartComp = (props) => {
    const { propData, dataKey, progKey, domain } = props;
    const data = [{ turn: '2025', co2: 1, co2prog: 1, ebit: null, ebitprog: 0.10, totalCo2: 1, totalCo2prog: 1 }, { turn: '2030', co2: null, co2prog: 0.75, ebit: null, ebitprog: 0.10 , totalCo2: null, totalCo2prog: 0.75 }, { turn: '2035', co2: null, co2prog: 0.50, ebit: null, ebitprog: 0.10 , totalCo2: null, totalCo2prog: 0.50 }, { turn: '2040', co2: null, co2prog: 0.25, ebit: null, ebitprog: 0.10 , totalCo2: null, totalCo2prog: 0.25 }, { turn: '2045', co2: null, co2prog: 0, ebit: null, ebitprog: 0.10 , totalCo2: null, totalCo2prog: 0 }];
    propData.forEach((element, index) => {
        // console.log(index, element)
        if(element) {
            if(element.ind_emissions) {
                data[index].co2 = element.ind_emissions;
            }
            if(element.ind_EBIT_marginal) {
                data[index].ebit = element.ind_EBIT_marginal;
            }
            if(element.total_emissions) {
                data[index].totalCo2 = element.total_emissions;
            }
        }
    });
    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{top: 10, right: 20, bottom: 10, left: 20}}>
                    <Line type="linear" strokeWidth={3} stroke="#2AA784" dataKey={dataKey} />
                    <Line type="linear" dataKey={progKey} stroke="#ccc" strokeWidth={3} strokeDasharray="3 3"  />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="turn" />
                    <YAxis domain={domain} hide />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

LineChartComp.propTypes = {
    title: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
    progKey: PropTypes.string.isRequired,
    domain: PropTypes.array.isRequired,
    // socket: PropTypes.object.isRequired
}

export default LineChartComp;

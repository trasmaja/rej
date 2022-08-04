import './supplyDemandGraph.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const SupplyDemandGraph = (props) => {
    const { propData, dataKey, progKey, domain } = props;
    const data = [{ turn: '2025', supply: null, demand: null}, { turn: '2030', supply: null, demand: null }, { turn: '2035', supply: null, demand: null }, { turn: '2040', supply: null, demand: null }, { turn: '2045', supply: null, demand: null }];
    propData.forEach((element, index) => {
        // console.log(index, element)
        if(element) {
            if(element.demand_el) {
                data[index].demand = element.demand_el;
            }
            if(element.supply_el) {
                data[index].supply = element.supply_el;
            }
        }
    });
    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{top: 10, right: 20, bottom: 10, left: 20}}>
                    <Line type="linear" strokeWidth={3} stroke="#0094A3" dataKey={"demand"} />
                    <Line type="linear" dataKey={"supply"} stroke="#EC6161" strokeWidth={3} />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="turn" />
                    <YAxis domain={domain} hide />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

SupplyDemandGraph.propTypes = {
    title: PropTypes.string.isRequired,
    domain: PropTypes.array.isRequired,
    // socket: PropTypes.object.isRequired
}

export default SupplyDemandGraph;

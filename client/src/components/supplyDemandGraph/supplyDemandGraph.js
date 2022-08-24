import './supplyDemandGraph.css';
import PropTypes from 'prop-types';
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const SupplyDemandGraph = (props) => {
    const { propData, turn, policy } = props;
    const data = [{ turn: '2022', supply: null, demand: null, cap: null, usable_supply_el: null, plannedCap: null }, { turn: '2025', supply: null, demand: null, cap: null, usable_supply_el: null, plannedCap: null }, { turn: '2030', supply: null, demand: null, cap: null, usable_supply_el: null, plannedCap: null }, { turn: '2035', supply: null, demand: null, cap: null, usable_supply_el: null, plannedCap: null }, { turn: '2040', supply: null, demand: null, cap: null, usable_supply_el: null, plannedCap: null }, { turn: '2045', supply: null, demand: null, cap: null, usable_supply_el: null, plannedCap: null }];
    propData.forEach((element, index) => {
        // console.log(index, element)
        if (element != null) {
            if (element.demand_el_total != null) {
                data[index].demand = element.demand_el_total;
            }
            if (element.supply_el_potential != null) {
                data[index].supply = element.supply_el_potential;
            }
            if (element.supply_el_cap) {
                data[index].cap = element.supply_el_cap;
                data[index].plannedCap = element.supply_el_cap;
            }

        }
    });
    if (policy && data[turn] && turn !== 1) {
        if (propData[turn - 1] != null) {
            data[turn].plannedCap = propData[turn - 1].supply_el_cap + propData[turn - 1].supply_el_cap_next[0];

        }

    }
    let plannedStam = null;
    if (policy) {
        plannedStam = <Line name="Planerad Stamnätsutbyggnad" type="linear" dataKey={"plannedCap"} stroke="#ccc" strokeWidth={3} strokeDasharray="3 3" />
    }


    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <XAxis stroke="#484D52" dataKey="turn" />
                    <YAxis width={5} stroke="#484D52" domain={[80, datamax => (datamax > 200 ? datamax + 20 : 200)]} tick={false} />
                    <CartesianGrid stroke="#ccc" />
                    {plannedStam}
                    <Line name="Stamnätskapacitet" type="linear" dataKey={"cap"} stroke="#fcba03" strokeWidth={3} />
                    <Line name="Elkonsumtion" type="linear" strokeWidth={3} stroke="#0094A3" dataKey={"demand"} />
                    <Line name="Elproduktion" type="linear" dataKey={"supply"} stroke="#EC6161" strokeWidth={3} />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

SupplyDemandGraph.propTypes = {
    title: PropTypes.string.isRequired,
    domain: PropTypes.array.isRequired,
    turn: PropTypes.number.isRequired,
    policy: PropTypes.bool.isRequired,
    // socket: PropTypes.object.isRequired
}

export default SupplyDemandGraph;

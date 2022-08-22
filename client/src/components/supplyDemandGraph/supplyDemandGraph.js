import './supplyDemandGraph.css';
import PropTypes from 'prop-types';
import React from 'react';
import { ReferenceLine, Label, AreaChart, LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const SupplyDemandGraph = (props) => {
    const { propData, turn, policy } = props;
    const data = [{ turn: '2022', supply: null, demand: null, cap: null, usable_supply_el: null, }, { turn: '2025', supply: null, demand: null, cap: null, usable_supply_el: null, }, { turn: '2030', supply: null, demand: null, cap: null, usable_supply_el: null, }, { turn: '2035', supply: null, demand: null, cap: null, usable_supply_el: null, }, { turn: '2040', supply: null, demand: null, cap: null, usable_supply_el: null, }, { turn: '2045', supply: null, demand: null, cap: null, usable_supply_el: null, }];
    propData.forEach((element, index) => {
        // console.log(index, element)
        if (element != null) {
            if (element.demand_el_cars != null && element.demand_el_ind != null) {
                data[index].demand = element.demand_el_cars + element.demand_el_ind;
            }
            if (element.supply_el != null) {
                data[index].supply = element.supply_el;
            }
            if (element.svk_cap) {
                data[index].cap = element.svk_cap;
            }

        }
    });
    if (policy && data[turn]) {
        if (propData[turn - 1].svk_cap_next[0] != null && propData[turn - 1].svk_cap != null) {
            console.log("dadadadada")
            data[turn].cap = propData[turn - 1].svk_cap + propData[turn - 1].svk_cap_next[0];

        }
    }
    return (
        <div className="wrapper-lineChart">
            <h3>{props.title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <XAxis stroke="#484D52" dataKey="turn" />
                    <YAxis width={5} stroke="#484D52" domain={[80, datamax => (datamax > 200 ? datamax + 20 : 200)]} tick={false} />
                    <CartesianGrid stroke="#ccc" />
                    <Line name="Efterfrågan" type="linear" strokeWidth={3} stroke="#0094A3" dataKey={"demand"} />
                    <Line name="Utbud" type="linear" dataKey={"supply"} stroke="#EC6161" strokeWidth={3} />
                    <Line name="Stamnätskapacitet" type="linear" dataKey={"cap"} stroke="#fcba03" strokeWidth={3} />
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

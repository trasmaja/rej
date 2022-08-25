import './decisionBasisWithGraph.css';
import PropTypes from 'prop-types';
import React from 'react';
import { ReferenceLine, Label, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';


const DecisionBasisWithGraph = (props) => {
    const { propData, title } = props;

    const data = [
        {
            name: 'låg',
            irr: 0,
        },
        {
            name: 'medel',
            irr: 0,
        },
        {
            name: 'hög',
            irr: 0,
        },
    ];

    propData.forEach((element, index) => {
        data[index].irr = Math.floor(element * 100);
    });

    return (
        <div className="wrapper-decisionBasisWithGraph">
            <h3>{title}</h3>
            <p>Internal rate of return (IRR) för investeringen givet ett lågt, medel eller högt CO2-pris jämfört med weighted average cost of capital (WACC).</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 15,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />
                    <YAxis width={20} tickCount={3} domain={[datamin => (datamin < 0 ? datamin : 0), datamax => (datamax + 5)]} />
                    <Bar dataKey="irr" fill="#2AA784" />
                    <ReferenceLine y={10} stroke="#EC6161" strokeDasharray="3 3" >
                        <Label fill='#EC6161' value="wacc" position="left" />
                    </ReferenceLine>
                    <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" >
                        <Label fill='#000' value="0" position="left" />
                    </ReferenceLine>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

DecisionBasisWithGraph.propTypes = {
    propData: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
}

export default DecisionBasisWithGraph;

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

    let min = null;
    let max = null;

    propData.forEach((element, index) => {
        const value = Math.floor(element * 100);
        data[index].irr = value;
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
        
    });

    let test = [-100, -90, -80, -70, -60, -50, -40, -30, -20, -15, -10, -5, 0, 5, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    test = test.filter(value =>  value === 0 || (value+5 > min && value-5 < max))
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
                        right: 20,
                        left: 20,
                        bottom: 5,
                    }}>

                    <XAxis strokeWidth={0} stroke="#999" dataKey="name" />
                    <YAxis ticks={test} strokeWidth={1} stroke="#999" width={20} domain={[datamin => datamin > 0 ? 0 : datamin , datamax => datamax < 10 ? 10 : datamax ]} />
                    <Bar dataKey="irr" fill="#2B3B55" />
                    <ReferenceLine strokeWidth={2} y={10} stroke="#EC6161"  strokeDasharray="4 4" >
                        <Label fill='#EC6161' value="wacc" position="left" />
                    </ReferenceLine>
                    <ReferenceLine strokeWidth={1} y={0} stroke="#999" >
                        {/* <Label fill='#999' value="0" position="right" /> */}
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

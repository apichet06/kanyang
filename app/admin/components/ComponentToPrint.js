'use client'
import React from 'react';

const ComponentToPrint = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <table>
            <thead>
                <tr>
                    <th>column 1</th>
                    <th>column 2</th>
                    <th>column 3</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>data 1</td>
                    <td>data 2</td>
                    <td>data 3</td>
                </tr>
                <tr>
                    <td>data 1</td>
                    <td>data 2</td>
                    <td>data 3</td>
                </tr>
                <tr>
                    <td>data 1</td>
                    <td>data 2</td>
                    <td>data 3</td>
                </tr>
            </tbody>
        </table>
    </div>
));

export default ComponentToPrint;

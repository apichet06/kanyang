'use client'
import { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
export default function ChartPage() {


    const chartData = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            type: 'bar',
            label: 'ยอดขายยางพารา',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                type: 'linear', // ลงทะเบียน scale 'linear'
                beginAtZero: true
            }
        },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: (value, context) => {
                    return context.chart.data.labels[context.dataIndex] + ': ' + value;
                }
            }
        }
    };


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-12 mt-5">
                    <div className="card">
                        <div className="card-body">
                            <h2>ยอดขายยางพารา</h2>
                            <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} height="70%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

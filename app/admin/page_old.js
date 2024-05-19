'use client'
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { api } from '../utils/config';
import axios from 'axios';


export default function ChartPage() {

    const chartData = {
        labels: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
        // labels: labal,
        datasets: [{
            label: 'ราคาประมูล',
            data: ['', '', '', '42.00', '33.00', '', '', '23.00', '', '', '', ''],
            borderWidth: 1
        }, {
            label: 'ราคาประมูล',
            data: ['', '', '', '', '36.00', '', '', '', '', '', '', ''],
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
                    return value;
                    // return context.chart.data.labels[context.dataIndex] + ': ' + value;
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
                            <h2>ราคาประมูลยางพารา</h2>
                            <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} height="70%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

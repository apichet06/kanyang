'use client'
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { api } from '../utils/config';
import axios from 'axios';


export default function ChartPage() {

    const [labal, setLabel] = useState([])

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice/data/chart');
            const data = response.data.data;
            console.log(data);
            const sortedData = data.sort((a, b) => parseInt(a.m_number) - parseInt(b.m_number));

            const labels = sortedData.map(month => month.m_name);
            setLabel(labels)

            const prices = sortedData.map(month =>
                month.data.map(entry => parseFloat(entry.r_rubber_price))
            );

            const datasets = prices.map((priceArr, index) => ({
                label: labels[index],
                data: priceArr,
                borderWidth: 1
            }));




        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [api]);


    useEffect(() => {
        fetchData()

    }, [fetchData]);





    const chartData = {
        // labels: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
        labels: labal,
        datasets: [{
            label: 'r_rubber_date',
            data: ['', '', '', '', '33', '', '', '', '', '', '', ''],
            borderWidth: 1
        }, {
            label: 'r_rubber_date',
            data: ['', '', '', '', '36', '', '', '', '', '', '', '10'],
            borderWidth: 1
        }, {
            label: 'r_rubber_date',
            data: ['', '', '', '', '41', '', '', '7', '', '', '', '11'],
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

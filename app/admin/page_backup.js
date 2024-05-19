'use client'
import { useCallback, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { api } from '../utils/config';


export default function ChartPage() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice/data/chart'); // Adjust the API endpoint if needed
            const data = response.data.data;

            // Sort data by month number
            const sortedData = data.sort((a, b) => parseInt(a.m_number) - parseInt(b.m_number));

            // Extract labels (month names)
            const labels = sortedData.map(month => month.m_name);

            // Prepare datasets
            const auctionPrices = sortedData.map(month =>
                month.data.length > 0 ? parseFloat(month.data[0].r_rubber_price) : 0
            );

            // To show two bars per month, prepare two datasets (if needed)
            const dataset1 = {
                label: 'ราคาประมูล 1',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: sortedData.map(month => month.data.length > 0 ? parseFloat(month.data[0].r_rubber_price) : 0)
            };

            const dataset2 = {
                label: 'ราคาประมูล 2',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: sortedData.map(month => month.data.length > 1 ? parseFloat(month.data[1].r_rubber_price) : 0)
            };

            setChartData({
                labels,
                datasets: [dataset1, dataset2]
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);



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
                formatter: (value) => value
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

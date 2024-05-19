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

            let maxRounds = 0;
            sortedData.forEach(month => {
                const maxRoundInMonth = month.data.reduce((max, entry) => Math.max(max, parseInt(entry.r_around)), 0);
                maxRounds = Math.max(maxRounds, maxRoundInMonth);
            });

            const getRandomColor = () => {
                const letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            };
            // Find the maximum r_around value
            const datasets = [];
            for (let round = 1; round <= maxRounds; round++) {
                const backgroundColor = getRandomColor();
                const borderColor = backgroundColor;
                datasets.push({
                    label: `ราคาประมูล รอบที่ ${round}`,
                    backgroundColor: backgroundColor + '95', // Adding transparency
                    borderColor: borderColor,
                    borderWidth: 1,
                    data: sortedData.map(month => {
                        const entry = month.data.find(d => parseInt(d.r_around) === round);
                        return entry ? parseFloat(entry.r_rubber_price) : '';
                    })
                });
            }

            // การใช้ datasets.push({}) เป็นการเพิ่มวัตถุ (object) ใหม่เข้าไปในอาร์เรย์ datasets โดย datasets เป็นอาร์เรย์ที่ใช้เก็บข้อมูลชุดต่างๆ ที่จะนำไปใช้ในการแสดงกราฟ
            // ตัวอย่าง
            // {
            //   label: "ราคาประมูล รอบที่ 1",
            //   backgroundColor: "rgba(54, 162, 235, 0.6)",
            //   borderColor: "rgba(54, 162, 235, 1)",
            //   borderWidth: 1,
            //   data: [0, 0, 0, 42.00, 33.00, 0, 0, 23.00, 0, 0, 0, 0]
            // }


            setChartData({
                labels,
                datasets
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [api]);

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
                formatter: (value) => value > 0 ? '฿' + value : ''
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
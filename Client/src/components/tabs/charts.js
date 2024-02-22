import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { useLocation } from 'react-router-dom'

const Charts = (props) => {
  const { ppiDistribution } = props;

  const ppiFormattedData = [
    ['PPI Score', 'Fraction'],
    ...Object.keys(ppiDistribution).map((item) => [Number(item), Number(ppiDistribution[item])])
  ].sort((a, b) => a[0] - b[0]);

  const path = useLocation()
  const getPath = () => {
    const baseUrl = 'https://netbio.bgu.ac.il/myprotein-results/MyProteinNet2Sessions/'
    const fileSuffix = 'output/DegreeDistribution.tsv'
    if (path.pathname.endsWith('sample')) {
      return `${baseUrl}Sample/${fileSuffix}`
    }
    const { jobName, time, userName } = localStorage
    const datetime = time.replace(' ', '_')
    return `${baseUrl}${userName}/${jobName}_${datetime}/${fileSuffix}`
  }

  const [degreesData, setDegrees] = useState();

  const fetchDegreesData = async () => {
    const url = getPath()
    const res = await fetch(url);
    const data = await res.blob();
    const reader = new FileReader();
    reader.onload = (e) => setDegrees([['degree', 'fraction'], ...String(e.target.result).split('\n')
      .map((i) => i.split('\t'))
      .filter((j) => j.length === 2)
      .map((k) => [parseFloat(k[0]), parseFloat(k[1])])]);
    reader.readAsText(data);
  }; 

  useEffect(() => {
    fetchDegreesData();
  }, []);

  return (
    <div className="ui grid">
      <div className="two column row">

        <div className="eight wide column" style={{ padding: '0px' }}>
          <Chart
            chartType="LineChart"
            loader={<div>Loading Charts</div>}
            // width="600px"
            height="500px"
            data={degreesData}
            options={{
              title: 'Node Degree Distribution',
              // bar: { gap: 0 },
              hAxis: {
                title: 'Degree',
                viewWindow: {
                  min: 0.0,
                  max: 700
                },
                logScale: true
              },
              vAxis: {
                title: 'Fraction',
                logScale: true
                // viewWindow: {
                //   min: 0.0,
                //   max: 0.1
                // },
                // format: '0.00000',
                // ticks: [0, 0.00001, 0.0001, 0.001, 0.005]
              },
              // series: { 0: { curveType: 'function' }, },
              legend: 'none',
              animation: {
                startup: true,
                easing: 'out',
                duration: 1500,
              },
              is3D: true
            }}
          />
        </div>

        <div className="eight wide column" style={{ padding: '0px' }}>
          <Chart
            chartType="LineChart"
            loader={<div>Loading Charts</div>}
            // width="600px"
            height="500px"
            data={ppiFormattedData}
            options={{
              title: 'Interaction Weight Distribution',
              bar: { gap: 0 },
              hAxis: {
                title: 'Weight',
                viewWindow: {
                  min: 0.0,
                  max: 1.0
                },
              },
              vAxis: {
                title: 'Fraction',
                viewWindow: {
                  min: 0.0,
                  max: 1.0
                }, 
              },
              series: { 0: { curveType: 'function' }, },
              legend: 'none',
              animation: {
                startup: true,
                easing: 'out',
                duration: 1200,
              },
              is3D: true
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default Charts;

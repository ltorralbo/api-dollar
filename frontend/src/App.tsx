import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { type Price } from './types'
import { PricesList } from './components/PricesList'
import Filters from './components/Filters'

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { 
  Grid, 
} from "@mui/material"; 
import { Box } from "@mui/system"; 

import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

function App() {
  dayjs.extend(utc);
  const [prices, setPrices] = useState<Price[]>([])
  const originalPrices = useRef<Price[]>([])
 
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(30, 'days'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  
  const handleStartDateChange = (newStartDate: Dayjs | null) => {
    setStartDate(newStartDate?.startOf('day') ?? null);
  };

  const handleEndDateChange = (newEndDate: Dayjs | null) => {
    setEndDate(newEndDate?.endOf('day') ?? null);
  };



  const filteredPrices = useMemo(() => {
    if (startDate && endDate) {

      // Filtrar los datos basándose en el rango de fechas
      const filteredItems = prices.filter((item) => {
        const itemDate = dayjs.utc(item.fecha).startOf('day').local(); // Redondear al inicio del día
        return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
      });
      return filteredItems
    } else {
      return prices
    }
  }, [prices, startDate, endDate])

  const handleDelete = (date: string) => {
    const filteredPrices = prices.filter((price) => price.fecha.toString() !== date)
    setPrices(filteredPrices)
  }

  const handleReset = () => {
    setPrices(originalPrices.current);
  }
  

  useEffect(() => {
    console.log("useEffect")
    if (startDate && endDate && startDate.isBefore(endDate)) {
      // Hacer dos llamadas a la API para los años 2033 y 2024
      const fetchPrices = async (year: number) => {
        try {
          const res = await fetch(`https://mindicador.cl/api/dolar/${year}`);
          const data = await res.json();
          return data.serie;
        } catch (err) {
          console.log(err);
          return [];
        }
      };

      Promise.all([fetchPrices(2033), fetchPrices(2024)])
        .then(([prices2033, prices2024]) => {
          // Combinar los resultados en orden
          const combinedPrices = [...prices2033, ...prices2024];
          setPrices(combinedPrices);
          originalPrices.current = combinedPrices;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },[])
  const lineColors = ['#573ebb'];


  const datasets: ChartData<'line', { key: string, value: number}[]> = {
    datasets: [{
      label: 'Precio del dólar',
      data: filteredPrices.map((item, index) => ({
        key: item.fecha.toString().slice(0, 10),
        value: parseInt(item.valor.toString(), 10),
      })),
      parsing: {
        xAxisKey: 'key',
        yAxisKey: 'value',
      },
      type: 'line',
      borderColor: lineColors,
      borderWidth: 2,
      fill: false,
    }],
  };

  return (
    <>
    <h1>Dolar App</h1>
    <Grid container spacing={3} > 
                    <Grid container item spacing={2} > 
                      <Grid item xs={12} xl={6}> 
                        <Box sx={{ backgroundColor: '#1f2837',  
                        padding: 1, textAlign: 'center', borderRadius: 2, }}> 
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                  <DatePicker
                                    label="Fecha de inicio"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    className="dates"
                                  />
                                  <DatePicker
                                    label="Fecha de fin"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    className="dates"
                                  />
                                </DemoContainer>
                                <button onClick={handleReset}>Resetear estado</button> 
                            </LocalizationProvider>
                            
                        </Box> 
                      </Grid>
                    </Grid>
                      <Grid item xs={12} xl={6}> 
                        <Box sx={{ backgroundColor: '#1f2837',  
                        padding: 1, textAlign: 'center',  borderRadius: 2,}}> 
                            <Line data={datasets} />
                        </Box> 
                      </Grid> 
                      <Grid item xs={12} xl={6}> 
                        <Box sx={{ backgroundColor: '#1f2837',  
                        padding: 1, textAlign: 'center', borderRadius: 2, }}> 
                             <PricesList  deletePrice={handleDelete} prices={filteredPrices}/>
                        </Box> 
      </Grid>
    </Grid> 
    </>
  )
}

export default App

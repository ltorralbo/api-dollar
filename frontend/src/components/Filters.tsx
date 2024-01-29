import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DataItem {
    id: number;
    date: string;
    // Otros campos si es necesario
  }
  
  const data: DataItem[] = [
    { id: 1, date: '2023-02-10' },
    { id: 2, date: '2023-02-13' },
    { id: 3, date: '2023-02-15' },
    // ... otros datos
  ];

export default function DateRangeFilter() {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [filteredData, setFilteredData] = React.useState<DataItem[]>([]);

  const handleFilter = () => {
    // Aquí puedes implementar la lógica para filtrar tus datos con el rango de fechas seleccionado

    if (startDate && endDate) {
        const filteredItems = data.filter((item) => {
            const itemDate = dayjs(item.date);
            return itemDate.isAfter(startDate) && itemDate.isBefore(endDate.add(1, 'day'));
            // Aseguramos que la fecha final sea inclusive, por lo tanto, agregamos 1 día al rango
          });
  
        setFilteredData(filteredItems);
      } else {
        console.error('Selecciona un rango válido de fechas');
      }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker
          label="Fecha de inicio"
          value={startDate}
          onChange={(newStartDate) => setStartDate(newStartDate)}
        />
        <DatePicker
          label="Fecha de fin"
          value={endDate}
          onChange={(newEndDate) => setEndDate(newEndDate)}
        />
        <button onClick={handleFilter}>Filtrar</button>
      </DemoContainer>
    </LocalizationProvider>
  );
}

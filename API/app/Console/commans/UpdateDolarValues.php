<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Dolar;

class UpdateDolarValues extends Command
{
    // ...

    public function handle()
    {
        $year = date('Y'); // Puedes ajustar el año según tus necesidades

        $dolarData = Dolar::getDolarValueFromAPI($year);

        if ($dolarData) {
            Dolar::storeDolarValue($dolarData);
            $this->info('Valores del dólar actualizados exitosamente.');
        } else {
            $this->error('Error al obtener los valores del dólar desde la API.');
        }
    }
}
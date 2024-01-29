<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateDolarValues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-dolar-values';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
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

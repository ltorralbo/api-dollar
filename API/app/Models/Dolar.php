<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use GuzzleHttp\Client;

class Dolar extends Model
{
    protected $fillable = ['date', 'value'];

    /**
     * Obtener el valor del dólar desde la API.
     *
     * @param int $year Año para el que obtener el valor del dólar.
     * @return array|null Datos del dólar o null si hay un error.
     */
    public static function getDolarValueFromAPI($year, $startDate, $endDate)
    {
        $apiEndpoint = "https://mindicador.cl/api/dolar/$year";

        try {
            $client = new Client();
            $response = $client->request('GET', $apiEndpoint);

            $data = json_decode($response->getBody(), true);
             print_r($data);
            if (isset($data['serie'][0]['fecha'], $data['serie'][0]['valor'])) {
                return [
                    'date' => $data['serie'][0]['fecha'],
                    'value' => $data['serie'][0]['valor'],
                ];
            }
        } catch (\Exception $e) {
            // Manejar el error (puedes registrar el error, lanzar una excepción, etc.)
            return null;
        }

        return null;
    }

    /**
     * Almacenar los valores del dólar en la base de datos.
     *
     * @param array $data Datos del dólar.
     * @return void
     */
    public static function storeDolarValue($data)
    {
        self::create([
            'date' => $data['date'],
            'value' => $data['value'],
        ]);
    }
}

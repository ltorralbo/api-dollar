<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DolarController extends Controller
{
     /**
     * Obtener los valores del dólar para un rango de fechas.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDolarValuesByDateRange(Request $request)
    {
        // Validar los parámetros
        $request->validate([
            'startDate' => 'required|date_format:Y-m-d',
            'endDate' => 'required|date_format:Y-m-d',
        ]);

        // Obtener los valores del dólar dentro del rango de fechas
        $dolarValues = Dolar::whereBetween('date', [$request->input('startDate'), $request->input('endDate')])->get();

        // Verificar si se encontraron valores
        if ($dolarValues->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron valores del dólar para el rango de fechas proporcionado.',
                 ], 404);
        }

        echo "Hola, esto se imprimirá en la consola!\n";

        // Puedes usar print también:
                
        return response()->json([
            'dolar_values' => $dolarValues,
        ]);
    }
}

import { type Price} from '../types.d'

interface Props {
    deletePrice: (date : string) => void
    prices: Price[]
}

export function PricesList ({ prices, deletePrice } : Props){
    return (
        <table width='100%'>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Valor</th>
                    <th>Acciones</th>
                </tr> 
            </thead>
            <tbody>
                {
                prices.map((price, index) =>{
                    console.log("este el price:"+JSON.stringify(price))
                    const backgroundColor: string = index > 0 && price.valor < prices[index - 1].valor ? '#E3401D' : '#12CD7B';

                    return (
                        <tr key={price.fecha.toString()} >
                            <td style={{ color: backgroundColor }}>{price.fecha.toString().slice(0, 10)}</td>
                            <td  style={{ color: backgroundColor }}>{price.valor}</td>
                            <td>
                                <button onClick={() => {
                                    deletePrice(price.fecha.toString())
                                }} >Borrar</button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
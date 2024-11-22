import { Readings } from '../../Interfaces/ListMeasures/measuresInterface';

export default function Reading({
  measure_uuid,
  measure_datetime,
  measure_type,
  has_confirmed,
  image_url,
}: Readings) { //TIPA AS PROPS DE ACORDO COM A INTERFACE DE CADA LEITURA
  // E RENDERIZA CADA LEITURA DE FORMA INDIVIDUAL
  return (
    < tbody >
      <tr key={measure_uuid}>
        <td>{measure_uuid}</td>
        <td>{measure_datetime}</td>
        <td>{measure_type === 'WATER' ? 'Água' : 'Gás'}</td>
        <td>{has_confirmed ? 'Confirmado' : 'Pendente'}</td>
        <td>
          <img src={image_url} alt="Imagem de Medição" width="50" />
        </td>
      </tr>
    </ tbody>

  );
}

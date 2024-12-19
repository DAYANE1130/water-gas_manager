import { useState, useContext, ChangeEvent } from "react";
import ListMeasuresContext from "../../Context/Listmeasures/ListMeasuresContext";

import Reading from "./Measure";
import { IReadings } from "../../Interfaces/ListMeasures/measuresInterface";

export default function listMeasures() {

  // USANDO O CONTEXTO GERAL
  const { fetchCustomerList } = useContext(ListMeasuresContext); // GENERICS?

  //CRIANDO ESTADOS LOCAIS
  const [loading, setLoading] = useState(false);
  const [customerCode, setCustomerCode] = useState('');
  const [searchCustomerCode, setSearchCustomerCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [readings, setReadings] = useState<IReadings[] | undefined>([]);
  const [filterTypeReadings, setFilterTypeReadings] = useState<"all" | "WATER" | "GAS">("all");


  //FUNÇÃO PARA PEGAR O CÓDIGO DO CLIENTE 
  const handleCustomerCode = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomerCode(event.target.value);
  }
  //FUNÇÃO PARA FAZER CHAMADA A API COM O CÓDIGO DO CLIENTE INFORMADO


  const handleFetchMeasures = async () => {

    if (!customerCode) {// dessa forma o erro da api é sobreposto e não aparece //essa mensagem de erro abaixo, só funciona se colocar esse return na ultima linha
      setErrorMessage('Por favor insira o código de um cliente');
      return // é o mesmo que dizer "parei por aqui, não prossiga!"
    }

    setLoading(true) // antes de fazer chamada a Api para aparecer algo na tela enquanto aguardamos resposta da API
    const response = await fetchCustomerList(customerCode);


    if (response.data) {
      setReadings(response.data?.measures);
      setSearchCustomerCode(response.data.customer_code)
      setErrorMessage(null);
    } else if (response.erro) {
      //SE EU TENHO UMA MENSAGEM DE ERRO ENTÃO EXIBO SOMENTE A TAG DO ERRO
      setErrorMessage(response.erro?.error_description);
      setReadings([]);
    }
    setLoading(false) // após a resposta ser processada altera o loading para false para que seja exibido na tela a resposta de sucesso ou erro
    setCustomerCode('');
  }
  // GURDAR DESSA FORMA EM UMA CONSTANTE O ARRAY E FAZER UM *TERNARIO* DE ACORDO COM O ESTADO
  // DO TIPO DE LEITURA EVITA A NECESSIDADE DE CRIAR MAIS UM ESTADO
  const filteredReadings = filterTypeReadings === "all" ? readings : readings?.filter((reading) => reading.measure_type === filterTypeReadings.toUpperCase());

  if (loading) {
    return <h1>Carregando...</h1>
  }

  return (
    <div >


      <h1>Histórico de Leituras</h1>
      <div>
        <input onChange={handleCustomerCode} placeholder="Insira aqui o código do cliente" type="text" required name="customer-code" value={customerCode} />
        <button onClick={handleFetchMeasures}>Buscar Leituras</button>
      </div>

      {/* <p>{errorMessage}</p> */}


      <br /><br />

      {filteredReadings && filteredReadings.length > 0 ?
        <div>
          <div>
            { /* Aplicando filtros por tipo de leitura */}
            <label htmlFor="all">
              <input onChange={() => setFilterTypeReadings('all')} type="radio" id="all" name="type-measure" value="all" checked={filterTypeReadings === 'all'} />
              Todas
            </label>
            <label htmlFor="water">
              <input onChange={() => setFilterTypeReadings('WATER')} type="radio" id="water" name="type-measure" value="water" checked={filterTypeReadings === 'WATER'} />
              Água
            </label>
            <label htmlFor="gas">
              <input onChange={() => setFilterTypeReadings('GAS')} type="radio" id="gas" name="type-measure" value="gas" checked={filterTypeReadings === 'GAS'} />
              Gás
            </label>
          </div>

          <div>
            { /* Fazer renderização condional a partir daqui */}
            <h3>Leituras do cliente : {searchCustomerCode}</h3>

            <table>
              { /* Tabela para mostrar leituras */}

              <thead>
                <tr>
                  <th>Código da leitura</th>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Imagem</th>
                </tr>
                { }
              </thead>

              {/* renderizar aqui a resposta 200 de sucesso da api */}

              {filteredReadings.map((reading) => (
                // ENVIA AS PROPRIEDADES PARA COMPONENTE FILHO VIA PROPS
                <Reading
                  key={reading.measure_uuid}
                  measure_uuid={reading.measure_uuid}
                  measure_datetime={reading.measure_datetime}
                  measure_type={reading.measure_type}
                  has_confirmed={reading.has_confirmed}
                  image_url={reading.image_url}

                />
              ))}
            </table>

          </div>
        </div>
        : errorMessage && <p style={{ color: 'red' }}>{errorMessage} </p>}
    </div>

  )
}



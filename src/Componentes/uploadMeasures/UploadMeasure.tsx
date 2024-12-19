import { useState, useEffect } from "react";
import { IReadingUpload, IResponseApi } from "../../Interfaces/UploadMeaures/uploadInterface";
import { fileToBase64 } from "../../services/convertImageForBase64";


export default function UploadMeasure() {
  /*  TYPESCRIPT: OS DADOS INICIAIS DEVEM SER TIPADOS DE ACORDO COM OS DADOS ESPERADOS PELO BODY DA REQUISIÇÃO COMO ABAIXO*/
  const initialFormInfo: IReadingUpload = {
    image: '',
    customerCode: '',
    measureDatetime: '',
    measureType: ''
  }

  const initialSuccessMessage = {
    imageUrl: '',
    measureUuid: '',
    measureValue: 0,
  }

  const [formInfo, setFormInfo] = useState<IReadingUpload>(initialFormInfo);
  const [listErrorTypeData, setListErrorTypeData] = useState([]);
  const [successMessage, setSuccessMessage] = useState(initialSuccessMessage);
  const [errorMessage, setErrorMessage] = useState('');


  //CRIANDO UM HANDLE GENÉRICO PARA ALTERAÇÃO DOS ESTADOS DOS INPUTS
  const handleFormInfo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = event.target;
    //console.log('eu sou type e files:', type, files)
    if (files && type === 'file') {
      const imageBase64 = await fileToBase64(files[0])
      const stringBase64 = imageBase64.replace(/^data:.+;base64,/, '');

      setFormInfo({ ...formInfo, image: stringBase64 })
    } else {
      setFormInfo({ ...formInfo, [name]: value })
    }

  }
  // A FUNÇÃO ACIMA É SUFICIENTE PARA OS ESTADOS DOS INPUTS RADIOS -'AGUA OU GAS'?

  useEffect(() => {
    console.log('form atualizado', formInfo)
  }, [formInfo])

  // FUNÇÃO QUE FAZ CHAMADA A API - REFATORAR PASSO A PASSO
  console.log('Estado de listErrorTypeData:', listErrorTypeData);
  console.log('Estado de successMessage:', successMessage);
  console.log('Estado de errorMessage:', errorMessage);
  
  //Mover essa função para camada service
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>):Promise<IResponseApi |undefined> => {
    //PREVINO COMPORTAMENTO PADRÃO DA FORMULARIO
    event.preventDefault();

    // FAZ CHAMADA A API
    try {
      console.log('eusou o body antes da req', formInfo)
      const response = await fetch(`http://localhost:3000/upload`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formInfo),
        });
      console.log('eu sou o body enviado na req depois da req', formInfo)
      console.log('eusou data do upload e status', response)

      // DATA É TODO O TIPO DE RESPOSTA DA API CONVERTIDO PARA JSON
      const data = await response.json();
      console.log('eu o data de response.json', data)
      // CASO EXISTA UMA RESPOSTA DE SUCESSO 
      if (data && response.ok) {
        setSuccessMessage(data)
        setErrorMessage('');
        setFormInfo({ ...formInfo, ...initialFormInfo })
        return data;
        // CASO EXISTA ERRO 400 ERROS DE VALIDAÇÃO  
      } else if (data && response.status === 400) {
        console.log('eu sou os erros de validação', data)
        setListErrorTypeData(data)
        setSuccessMessage(initialSuccessMessage)
        setErrorMessage('');
        // CASO EXISTA ERRO 409 ERROS DE REGRA DE NEGÓCIO
      } else if (data && response.status === 409) {
        console.log('eu sou os erros de regra de negócio', data.error_description)
        setErrorMessage(data.error_description);
        setSuccessMessage(initialSuccessMessage)
        setFormInfo({ ...formInfo, ...initialFormInfo })
        return data.error_description
      }
      //12/12 incluindo erro ao fazer leitura, leitura não é um número
      else if (data && response.status === 422) {
        console.log('eu sou os erros de regra de negócio da leitura', data.error_description)
        setErrorMessage(data.error_description);
        setSuccessMessage(initialSuccessMessage)
        setFormInfo({ ...formInfo, ...initialFormInfo })
        return data.error_description
      }
      // POR FIM CASO A API NÃO TENHA NENHUMA DAS RESPOSTAS ESPERADAS ACIMA
    } catch (error:any) {
      console.error('Erro ao fazer requisição:', error.message);
      setErrorMessage('Erro ao se conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.')

      setFormInfo({ ...formInfo, ...initialFormInfo })
    }
    return {
      erro: {
        error_code: '500',
        error_description: 'Erro inesperado, tente novamente mais tarde',
      },
    };
  }



  return (
    <div>

      <h1>Upload de Imagens</h1>

      <form onSubmit={handleSubmit} method="post">

        <label htmlFor="image-measure">
          Insira aqui a imagem da leitura
          <input onChange={handleFormInfo} type="file" id="image-measure" name="image" /*value={formInfo.image}*/ required />
        </label>
        <br /><br />

        <label htmlFor="customer-code">
          Insira o código do cliente
          <input onChange={handleFormInfo} type="text" id="customer-code" name="customerCode" value={formInfo.customerCode} required />
        </label>
        <br /><br />

        <label htmlFor="measure-datetime">
          Insira a data e hora da leitura
          <input onChange={handleFormInfo} type="datetime-local" id="measure-datetime" name="measureDatetime" value={formInfo.measureDatetime} required />
        </label>
        <br /><br />

        <p> Escolha o tipo de leitura abaixo:</p>
        <label htmlFor="measure-type-water">
          <input onChange={handleFormInfo} type="radio" id="measure-type-water" name="measureType" value='WATER' required />
          ÁGUA
        </label>

        <label htmlFor="measure-type-gas">
          <input onChange={handleFormInfo} type="radio" id="measure-type-gas" name="measureType" value='GAS' required />
          GAS
        </label>

        <br /><br />
        <button type="submit">Enviar</button>

      </form>
      <ul>
        {listErrorTypeData && listErrorTypeData.length > 0 && listErrorTypeData.map((errorValidation, index) => (
          <li key={index} style={{ color: 'red' }}> {errorValidation}</li>
        ))}
      </ul>
      {successMessage.imageUrl && <div>
        <p> Leitura criada com sucesso</p>
        <p> {successMessage.measureUuid}</p>
        <p> {successMessage.measureValue}</p>
        <p> {successMessage.imageUrl}</p>
      </div>}
      {errorMessage && <p style={{ color: 'red' }}> {errorMessage}</p>}
      
    </div>

  )
}


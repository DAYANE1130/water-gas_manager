import { useState } from "react"


export default function ConfirmMeasure() {

  const [formInfo, setFormInfo] = useState({ measure_uuid: '', confirmed_value: 0 });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newValue = name === 'confirmed_value' ? Number(value) : value;
    setFormInfo({ ...formInfo, [name]: newValue })
  }

  // ACREDITO QUE O PROXIMO PASSO É USAR ESSES ESTADOS PARA FAZER A CHAMADA API
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('eu sou evento do handlesubmit', event)

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/confirm`,
        {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formInfo),
        });
      const data = await response.json();
      console.log('eusou data do update', data)
      if (response.ok) {
        setSuccessMessage(data.success)
        setErrorMessage('');
        setFormInfo({ ...formInfo, measure_uuid: '', confirmed_value: 0 })


        return data.success;
      } else {
        setErrorMessage(data.error_description);
        setSuccessMessage('')
        setFormInfo({ ...formInfo, measure_uuid: '', confirmed_value: 0 })

        return data.error_description
      }

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false)

    }

  }


  if (loading) {
    return <p>Carregando ...</p>
  }

  return (
    <>
      <h1>Confirmação das leituras</h1>
      <form onSubmit={(event) => handleSubmit(event)} method="patch">
        {/* <form action="" method=""> */}
        <label htmlFor="measure-uuid">
        Insira aqui o código da leitura
          <input onChange={handleFormInfo} id="measure-uuid" type="text" name="measure_uuid" value={formInfo.measure_uuid} required />
        </label>
        <br /><br />
        <label htmlFor="confirmed-value">
        Insira aqui o novo valor
          <input onChange={handleFormInfo} id="confirmed-value" type="number" name="confirmed_value" value={formInfo.confirmed_value} required />
        </label>
        <br /><br />

        <button type="submit">Enviar</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "red" }}> Leitura atualizada com sucesso</p>}

      
    </>
  )
}





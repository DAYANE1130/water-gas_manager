//import {  useState } from 'react';
import ListMeasuresProvider from './Context/Listmeasures/ListMeasuresProvider';
import ListMeasures from './Componentes/listMeasures/ListMeasures';
import ConfirmMeasure from './Componentes/updateMeasures/ConfirmMeasure';

function App() {
  //const [message, setMessage] = useState('');

  //IHUUUUUUUUUUUU DEU CERTO
  /*useEffect(() => {
    fetch('http://localhost:3000/customer/13example_customer_code/list') // A porta deve coincidir com a do seu backend
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Erro ao buscar dados:', error));
  }, []);
  */

  return (
    <>
      <ListMeasuresProvider>
        { /*     <div className="App">
        <h1>Teste de Comunicação com o Backend</h1>
        <p>{message}</p>
      </div>*/}
        <ListMeasures />
      </ListMeasuresProvider>

      <div>
        <ConfirmMeasure/>
      </div>
    </>



  );
}

export default App;
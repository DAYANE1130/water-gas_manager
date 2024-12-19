//import {  useState } from 'react';
import ListMeasuresProvider from './Context/Listmeasures/ListMeasuresProvider';
import ListMeasures from './Componentes/listMeasures/ListMeasures';
import ConfirmMeasure from './Componentes/updateMeasures/ConfirmMeasure';
import UploadMeasure from './Componentes/uploadMeasures/UploadMeasure';
import { Route, Routes } from 'react-router-dom';

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
    <Routes>
      <Route path="/leituras" element={
        <ListMeasuresProvider>
        <ListMeasures />
      </ListMeasuresProvider>}
      />
      <Route path="/confirm" element={<ConfirmMeasure />} />

      <Route path="/upload" element={<UploadMeasure />} />
  
    </Routes>



  );
}

export default App;
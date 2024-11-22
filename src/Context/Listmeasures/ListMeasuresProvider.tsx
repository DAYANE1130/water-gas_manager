import { useEffect } from "react";
import ListMeasuresContext from "./ListMeasuresContext";
import { ResponseApi } from "../../Interfaces/ListMeasures/measuresInterface";



type ListMeasuresProviderProps = {

  children: React.ReactNode;

}



export default function ListMeasuresProvider({ children }: ListMeasuresProviderProps) {

  // ESTADO GLOBAL QUE SERÁ COMPARTILHADO




  const fetchCustomerList = async (customer_code:string): Promise<ResponseApi> => {
    try {
      const response = await fetch(`http://localhost:3000/customer/${customer_code}/list`);
      // const response = await fetch('http://localhost:3000/customer/13example_customer_code/list')
      const data = await response.json();

      // Atualiza o estado com as leituras
     // setCustomerListMeasure(data.measures);

      // Retorna um objeto do tipo ResponseApi com os dados da API
      //console.log("eu so data do fetch",data)
  
      if (response.ok) {
        return { data, erro: undefined }; // Sucesso
      } else {
        return { data: undefined, erro: data }; // Erro
      }
    } catch (error) {
      console.error(error);

      // Retorna um objeto do tipo ResponseApi com informações de erro
      return {
        data:undefined,
        erro: {
          error_code: "FETCH_ERROR",
          error_description: "Não foi possível buscar a lista de leituras.",
        },
      };
    }
  };

  useEffect(() => {
    const initialCustomerCode = "13example_customer_code"; // Substitua ou remova se não quiser chamada inicial
    fetchCustomerList(initialCustomerCode);
  }, []);

  // useEffect(() => {
  //   const fetchCustomerList = async (): Promise<ResponseApi> => {
  //     try {
  //       // const response = await fetch(`http://localhost:3000/customer/${customer_code}/list`);
  //       const response = await fetch('http://localhost:3000/customer/13example_customer_code/list')
  //       const data = await response.json();
  
  //       // Atualiza o estado com as leituras
  //       console.log('eu sou data',data)

   
  //       setCustomerListMeasure(data.measures);
  
  //       // Retorna um objeto do tipo ResponseApi com os dados da API
  //       //console.log("eu so data do fetch",data)
  //       return data;
  //     } catch (error) {
  //       console.error(error);
  
  //       // Retorna um objeto do tipo ResponseApi com informações de erro
  //       return {
  //         erro: {
  //           error_code: "FETCH_ERROR",
  //           error_description: "Não foi possível buscar a lista de leituras.",
  //         },
  //       };
  //     }
  //   };
  //   fetchCustomerList()
  // }, [])

  return (
    < ListMeasuresContext.Provider value={{
     // readings: customerListMeasure, setCustomerListMeasure,

      fetchCustomerList
    }} >
      <div>
        {children}
      </div>
    </ListMeasuresContext.Provider>

  )
}
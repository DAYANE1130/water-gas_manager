import { createContext } from "react";
import { ResponseApi } from "../../Interfaces/ListMeasures/measuresInterface";

type ListMeasuresContextType = {
 // readings: Readings[],
  //setCustomerListMeasure: React.Dispatch<React.SetStateAction<Readings[]>>

  fetchCustomerList: (customer_code:string) => Promise<ResponseApi>// QUANDO A FUNÇÃO TIVER UM PARAMETRO TEM QUE TIPAR

};

const ListMeasuresContext = createContext<ListMeasuresContextType>(
  {
   // readings: [],
    // setCustomerListMeasure: () => { },
    fetchCustomerList: async (): Promise<ResponseApi> => {
      return {
        data: undefined,
        erro: {
          error_code: "MOCK_ERROR",
          error_description: "Função não implementada no contexto inicial."
        }
      };
    }
  });

export default ListMeasuresContext;
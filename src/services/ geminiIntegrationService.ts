import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';


type UploadFileResponse = {
  file: {
    uri: string;
  };
};


dotenv.config();

const apiKey: string | undefined = process.env.MY_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let fileManager: GoogleAIFileManager;


if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  fileManager = new GoogleAIFileManager(apiKey);
}

const uploadImageGemini = async (base64Image: string) => {

  if (!genAI) {
    throw new Error('Google Generative AI service is not initialized');

  }
  // Converte a imagem Base64 para Buffer e salva temporariamente
  const buffer = Buffer.from(base64Image, 'base64');
  const tempFilePath = path.join('uploads', 'tempImage.jpg');
  //fs.writeFileSync(tempFilePath, buffer);
  await fs.promises.writeFile(tempFilePath, buffer);


  const uploadResponse = await fileManager.uploadFile(tempFilePath, {
    mimeType: "image/jpeg",
    displayName: "Measure Value water or gas",
  });

  return uploadResponse
}

const geminiIntegrationService = {

  async generateContextGemini(base64Image: string) {

    if (!genAI) {
      throw new Error('Google Generative AI service is not initialized');
    };

    try {
      // Refatorar para tentar o modelo pro e flash em caso de falha
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", });
      //console.log('eu sou o model do gemini', model)

      // pegando resposta do upload
      const responseUploadFile = await uploadImageGemini(base64Image);

      //console.log('eu sou a resposta do upload ', responseUploadFile)
      //console.log('eu sou a imagem uri ', image_url)
      if (!responseUploadFile) {
       // throw new Error('Falha no upload da imagem');
        return false;
      }
      const image_url = responseUploadFile.file.uri;
      if (!image_url) {
       // throw new Error('Falha na URI da imagem.');
        return false;
      }

      // Gerando um contexto usando a URI referenciada no uploadFile

      const inputData = [
        {
          fileData: {
            mimeType: responseUploadFile.file.mimeType,
            fileUri: responseUploadFile.file.uri,
          },
        },
        { text: "Qual a medida? Me responda somente com os caracteres do numero da medida sem nenhum texto adicional" },
      ];
      // console.log('Dados enviados para generateContent:', JSON.stringify(inputData, null, 2));


      let result;
      try {
        result = await model.generateContent(inputData);
        //console.log('Resultado do generateContent:', result)
        //   // 05/12 adicionei linhas 94 e 95
        // if(!result){
        //   return {success:false, error: 'Erro ao fazer leitura'}
        // }
      } catch (error: any) {
        console.error('Erro no generateContent:', error.message || error);
        if (error.response) {
          // console.error('Status HTTP:', error.response.status);
          // console.error('Headers da Resposta:', error.response.headers);
          // console.error('Corpo da Resposta:', error.response.data);
          console.error('Detalhes da resposta de erro:', error.response.data || error.response);
        }
        throw new Error('Erro ao gerar conteúdo no Gemini API: ' + error.message);
      }


      // console.log('eu sou o prompt result', result)
      const resultText = result.response.text();
      //console.log('Texto retornado pelo modelo:', resultText);

      // Regex para capturar apenas números
      // Regex para capturar apenas números
      const match = resultText.match(/\d+/g); // Isso captura todos os grupos de números na string
      const measure_value = match ? parseInt(match.join('')) : NaN; // Une todos os grupos numéricos e converte para número

      console.log('Número extraído:', measure_value);

      console.log('eu verififico se a leitura é um numero', typeof measure_value, measure_value)
      if (isNaN(measure_value) || measure_value <= 0) {
        //05/12 quando enviei "b" deu resposta zero podemos pensar em algo
        /* não entro nesse erro entrou no catch*/ 
        //throw new Error('O valor da leitura não é um número');
        console.log('entrei no isNan')
        return { // 05/12
          success: false, error: { error_code: 'UNPROCESSABLE ENTITY', error_description: 'O valor da leitura não é um número, por favor verifique a imagem enviada' } 
        }
      }
      return {
        image_url,
        measure_value
      };

    } catch (error) {
     // throw new Error('Failed to get reading from Gemini API: ' + error);
     return { //05/12
      success: false, error: { error_code: 'BAD_REQUEST', error_description: 'Failed to get reading from Gemini API' } 
    }
    }
  }
}

export default geminiIntegrationService;

// SUGESTÃO DE TRATAMENTO DE ERROS

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GoogleAIFileManager } from "@google/generative-ai/server";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";

// dotenv.config();

// const apiKey: string | undefined = process.env.MY_GEMINI_API_KEY;

// let genAI: GoogleGenerativeAI | null = null;
// let fileManager: GoogleAIFileManager;

// if (apiKey) {
//   genAI = new GoogleGenerativeAI(apiKey);
//   fileManager = new GoogleAIFileManager(apiKey);
// }

// // Função utilitária para padronizar erros
// const createErrorResponse = (errorCode: string, description: string) => ({
//   success: false,
//   error: {
//     error_code: errorCode,
//     error_description: description,
//   },
// });

// // Upload da imagem
// const uploadImageGemini = async (base64Image: string) => {
//   try {
//     if (!fileManager) {
//       return createErrorResponse(
//         "UPLOAD_INIT_ERROR",
//         "FileManager do Google Generative AI não foi inicializado."
//       );
//     }

//     // Converte a imagem Base64 para Buffer e salva temporariamente
//     const buffer = Buffer.from(base64Image, "base64");
//     const tempFilePath = path.join("uploads", "tempImage.jpg");
//     fs.writeFileSync(tempFilePath, buffer);

//     const uploadResponse = await fileManager.uploadFile(tempFilePath, {
//       mimeType: "image/jpeg",
//       displayName: "Measure Value water or gas",
//     });

//     return { success: true, data: uploadResponse };
//   } catch (error: any) {
//     return createErrorResponse(
//       "UPLOAD_FAILURE",
//       "Falha ao fazer upload da imagem: " + (error.message || "Erro desconhecido.")
//     );
//   }
// };

// // Serviço principal de integração
// const geminiIntegrationService = {
//   async generateContextGemini(base64Image: string) {
//     if (!genAI) {
//       return createErrorResponse(
//         "SERVICE_INIT_ERROR",
//         "Google Generative AI não foi inicializado."
//       );
//     }

//     try {
//       // Upload da imagem
//       const uploadResponse = await uploadImageGemini(base64Image);

//       if (!uploadResponse.success) {
//         return uploadResponse; // Retorna erro do upload
//       }

//       const { file } = uploadResponse.data;
//       if (!file || !file.uri) {
//         return createErrorResponse(
//           "UPLOAD_RESPONSE_INVALID",
//           "Resposta de upload inválida ou URI ausente."
//         );
//       }

//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       // Input para o modelo
//       const inputData = [
//         {
//           fileData: {
//             mimeType: file.mimeType,
//             fileUri: file.uri,
//           },
//         },
//         {
//           text: "Qual a medida? Me responda somente com os caracteres do número da medida, sem texto adicional.",
//         },
//       ];

//       const result = await model.generateContent(inputData);

//       // Processar resposta do modelo
//       const resultText = result.response.text();
//       const match = resultText.match(/\d+/g); // Captura números
//       const measureValue = match ? parseInt(match.join("")) : NaN;

//       if (isNaN(measureValue)) {
//         return createErrorResponse(
//           "PARSE_ERROR",
//           "Não foi possível extrair um valor numérico da resposta."
//         );
//       }

//       return {
//         success: true,
//         data: {
//           image_url: file.uri,
//           measure_value: measureValue,
//         },
//       };
//     } catch (error: any) {
//       return createErrorResponse(
//         "API_FAILURE",
//         "Falha ao comunicar com a API do Gemini: " + (error.message || "Erro desconhecido.")
//       );
//     }
//   },
// };

// export default geminiIntegrationService;

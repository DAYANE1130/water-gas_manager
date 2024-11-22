// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GoogleAIFileManager } from "@google/generative-ai/server";
// import dotenv from 'dotenv';

// dotenv.config();

// const apiKey: string | undefined = process.env.MY_GEMINI_API_KEY;

// let genAI: GoogleGenerativeAI | null = null;
// let fileManager: GoogleAIFileManager;

// if (apiKey) {
//   genAI = new GoogleGenerativeAI(apiKey);
//   fileManager = new GoogleAIFileManager(apiKey);
// }

// const uploadImageGemini = async (base64Image: string,) => {
//   // Converte a imagem Base64 para Buffer
//   //const buffer = Buffer.from(base64Image, 'base64');

//   const uploadResponse = await fileManager.uploadFile("/home/dayane/PROJETOS_TESTES_TECNICOS/project_water&gas_manager/app/backend/uploads/HIDROMETRO.jpeg", {
//     mimeType: "image/jpeg",
//     displayName: "Measure Value water or gas",
//   });
//   if (!genAI) {
//     throw new Error('Google Generative AI service is not initialized');
//   }
//   return uploadResponse;
// }

// const geminiIntegrationService = {

//   async generateContextGemini(base64Image: string) {

//     if (!genAI) {
//         throw new Error('Google Generative AI service is not initialized');
//     };

//     try {

//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", });

//       // pegando resposta do upload
//       const responseUploadFile = await uploadImageGemini(base64Image);
//       const image_url = responseUploadFile.file.uri;

//       // Gerando um contexto usando a URI referenciada no uploadFile.
//       const result = await model.generateContent([
//         {
//           fileData: {
//             mimeType: responseUploadFile.file.mimeType,
//             fileUri: responseUploadFile.file.uri
//           }
//         },
//         { text: "Qual a medida?" },
//       ]);
//       const measure_value = Number(result.response.text().split(' ')[3]);

//       return {
//         image_url,
//         measure_value
//       };

//     } catch (error) {
//       throw new Error('Failed to get reading from Gemini API: ' + error);
//     }
//   }
// }

// export default geminiIntegrationService;


import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';


dotenv.config();

const apiKey: string | undefined = process.env.MY_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let fileManager: GoogleAIFileManager;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  fileManager = new GoogleAIFileManager(apiKey);
}

const uploadImageGemini = async (base64Image: string,) => {

  // Converte a imagem Base64 para Buffer e salva temporariamente
  const buffer = Buffer.from(base64Image, 'base64');
  const tempFilePath = path.join('uploads', 'tempImage.jpg');
  fs.writeFileSync(tempFilePath, buffer);

  const uploadResponse = await fileManager.uploadFile(tempFilePath, {
    mimeType: "image/jpeg",
    displayName: "Measure Value water or gas",
  });
  if (!genAI) {
    throw new Error('Google Generative AI service is not initialized');
  }
  //console.log('eu sou o uploadResponse', uploadResponse)
  return uploadResponse;
}

const geminiIntegrationService = {

  async generateContextGemini(base64Image: string) {

    if (!genAI) {
      throw new Error('Google Generative AI service is not initialized');
    };

    try {

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", });

      // pegando resposta do upload
      const responseUploadFile = await uploadImageGemini(base64Image);
      const image_url = responseUploadFile.file.uri;

      // Gerando um contexto usando a URI referenciada no uploadFile.
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: responseUploadFile.file.mimeType,
            fileUri: responseUploadFile.file.uri
          }
        },
        { text: "Qual a medida?" },
      ]);
      
      const measure_value = result.response.text().split(' ')[5].replaceAll('**', '');

      return {
        image_url,
        measure_value
      };

    } catch (error) {
      throw new Error('Failed to get reading from Gemini API: ' + error);
    }
  }
}

export default geminiIntegrationService;
// src/corsConfig.ts
import { CorsOptions }from 'cors';

const corsConfig: CorsOptions = {
  origin:true, // Você pode definir como 'http://localhost:3000' ou usar uma função para lógica mais complexa
  //origin:'http://localhost:5173',
  methods: ['GET', 'HEAD', 'POST', 'PUT','PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Adicione os headers que você precisa
  exposedHeaders: [],
  credentials:true,
  maxAge: 90,
};

export default corsConfig;
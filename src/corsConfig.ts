// src/corsConfig.ts
import { CorsOptions }from 'cors';

const corsConfig: CorsOptions = {
  origin:true, // Você pode definir como 'http://localhost:3000' ou usar uma função para lógica mais complexa
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Adicione os headers que você precisa
  exposedHeaders: [],
  credentials:true,
  maxAge: 90,
};

export default corsConfig;
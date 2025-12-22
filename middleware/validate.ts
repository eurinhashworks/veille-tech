import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware de validation Zod pour Express
 * @param schema - Le schéma Zod à valider contre req.body, req.query ou req.params
 */
export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Échec de la validation des données',
          errors: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
      return res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur lors de la validation',
      });
    }
  };

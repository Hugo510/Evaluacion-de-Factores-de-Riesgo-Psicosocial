/**
 * Servicio para la gestión de tokens JWT
 * @module services/tokenService
 */
import { env } from "../config/env";
import logger from "../config/logger";

/**
 * Clase que gestiona los tokens JWT, incluyendo la lista negra de tokens invalidados
 */
export class TokenService {
  // En producción, esta lista debería estar en Redis o una base de datos
  // para persistencia y escalabilidad entre múltiples instancias
  private static blacklistedTokens: Set<string> = new Set();

  /**
   * Añade un token a la lista negra (tokens invalidados)
   * @param token Token JWT a invalidar
   */
  static blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
    logger.info("Token añadido a la lista negra");

    // En un entorno real, podríamos establecer un TTL basado en la expiración del token
    // para que no crezca indefinidamente la lista

    // Ejemplo para implementación con Redis:
    // const decodedToken = jwt.decode(token) as { exp: number };
    // const ttl = decodedToken.exp - Math.floor(Date.now() / 1000);
    // await redisClient.setEx(`blacklist:${token}`, ttl, '1');
  }

  /**
   * Verifica si un token está en la lista negra
   * @param token Token JWT a verificar
   * @returns true si el token está invalidado, false de lo contrario
   */
  static isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  /**
   * Limpia tokens expirados de la lista negra (ejecutar periódicamente)
   * Esta implementación es un placeholder - en producción se manejaría
   * con TTL en Redis o tareas programadas en la base de datos
   */
  static cleanupBlacklist(): void {
    // Esta implementación simple solo simula la limpieza
    // En producción, Redis o la base de datos manejarían esto
    logger.info("Simulando limpieza de tokens expirados de la lista negra");
  }
}

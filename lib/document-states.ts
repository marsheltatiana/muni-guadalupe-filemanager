/**
 * Enum que representa los diferentes estados en los que puede estar un documento en el sistema
 */
export enum EstadoDocumento {
  /**
   * El documento está disponible en el sistema y puede ser solicitado para préstamo
   */
  DISPONIBLE = "DISPONIBLE",

  /**
   * Un usuario ha solicitado el préstamo del documento, pero aún no se ha procesado
   */
  SOLICITADO = "SOLICITADO",

  /**
   * La solicitud está siendo evaluada (por ejemplo, verificando disponibilidad o requisitos del usuario)
   */
  EN_REVISION = "EN_REVISION",

  /**
   * El documento fue entregado al usuario y está en su posesión
   */
  PRESTADO = "PRESTADO",

  /**
   * El plazo de préstamo ha expirado, pero el documento aún no ha sido devuelto
   */
  VENCIDO = "VENCIDO",
}

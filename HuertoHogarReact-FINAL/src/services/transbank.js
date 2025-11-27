import axios from 'axios';

/**
 * Cliente de Transbank para comunicarse con el servidor proxy
 * 
 * El servidor proxy (puerto 3001) maneja el SDK de Transbank,
 * ya que este no puede ejecutarse directamente en el navegador.
 */

const PROXY_URL = 'http://localhost:3001/api/transbank';

/**
 * Servicio de Transbank para procesar pagos con Webpay Plus
 */
const transbankService = {
  /**
   * Crear una nueva transacción de pago
   * @param {string} buyOrder - Número único de la orden
   * @param {string} sessionId - ID de sesión único
   * @param {number} amount - Monto a pagar en pesos chilenos
   * @param {string} returnUrl - URL a la que Transbank redirigirá después del pago
   * @returns {Promise<{token: string, url: string}>}
   */
  async createTransaction(buyOrder, sessionId, amount, returnUrl) {
    try {
      const response = await axios.post(`${PROXY_URL}/create`, {
        buyOrder,
        sessionId,
        amount,
        returnUrl
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Error al crear transacción');
      }

      return {
        token: response.data.token,
        url: response.data.url
      };
    } catch (error) {
      console.error('Error al crear transacción Transbank:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('No se puede conectar con el servidor de pagos. Asegúrate de que el servidor proxy esté ejecutándose en el puerto 3001.');
      }
      
      throw new Error(error.response?.data?.error || 'No se pudo iniciar el proceso de pago. Por favor intenta nuevamente.');
    }
  },

  /**
   * Confirmar una transacción después de que el usuario completó el pago
   * @param {string} token - Token retornado por Transbank
   * @returns {Promise<Object>} - Detalles de la transacción confirmada
   */
  async commitTransaction(token) {
    try {
      const response = await axios.post(`${PROXY_URL}/commit`, { token });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Error al confirmar transacción');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error al confirmar transacción Transbank:', error);
      throw new Error(error.response?.data?.error || 'No se pudo confirmar el pago. Por favor contacta a soporte.');
    }
  },

  /**
   * Obtener el estado de una transacción
   * @param {string} token - Token de la transacción
   * @returns {Promise<Object>}
   */
  async getTransactionStatus(token) {
    try {
      const response = await axios.get(`${PROXY_URL}/status/${token}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Error al obtener estado');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error al obtener estado de transacción:', error);
      throw new Error(error.response?.data?.error || 'No se pudo obtener el estado del pago.');
    }
  },

  /**
   * Refund de una transacción (devolución)
   * @param {string} token - Token de la transacción
   * @param {number} amount - Monto a devolver
   * @returns {Promise<Object>}
   */
  async refundTransaction(token, amount) {
    try {
      const response = await axios.post(`${PROXY_URL}/refund`, {
        token,
        amount
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Error al procesar devolución');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error al procesar devolución:', error);
      throw new Error(error.response?.data?.error || 'No se pudo procesar la devolución.');
    }
  },

  /**
   * Verificar si el servidor proxy está disponible
   * @returns {Promise<boolean>}
   */
  async checkServerHealth() {
    try {
      const response = await axios.get('http://localhost:3001/health');
      return response.data.status === 'OK';
    } catch (error) {
      return false;
    }
  }
};

export default transbankService;

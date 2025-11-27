/**
 * Servidor proxy para Transbank Webpay Plus
 * 
 * Este servidor actúa como intermediario entre el frontend React y Transbank,
 * ya que el SDK de Transbank no puede ejecutarse directamente en el navegador.
 * 
 * IMPORTANTE: Este servidor debe ejecutarse en paralelo con el backend Spring Boot
 * 
 * Puerto: 3001 (para no conflictuar con React en 3000 ni Spring Boot en 8080)
 */

import express from 'express';
import cors from 'cors';
import Transbank from 'transbank-sdk';

const { WebpayPlus, Environment } = Transbank;

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Frontend React
  credentials: true
}));
app.use(express.json());

// Configuración de Transbank para integración (pruebas)
const COMMERCE_CODE = '597055555532';
const API_KEY = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

// Crear instancia de WebpayPlus
const transaction = new WebpayPlus.Transaction(new Transbank.Options(COMMERCE_CODE, API_KEY, Environment.Integration));

/**
 * POST /api/transbank/create
 * Crear una nueva transacción de pago
 */
app.post('/api/transbank/create', async (req, res) => {
  try {
    const { buyOrder, sessionId, amount, returnUrl } = req.body;

    // Validaciones
    if (!buyOrder || !sessionId || !amount || !returnUrl) {
      return res.status(400).json({
        error: 'Faltan parámetros requeridos',
        required: ['buyOrder', 'sessionId', 'amount', 'returnUrl']
      });
    }

    if (amount < 50) {
      return res.status(400).json({
        error: 'El monto mínimo es de $50 CLP'
      });
    }

    console.log('Creando transacción Transbank:', {
      buyOrder,
      sessionId,
      amount,
      returnUrl
    });

    // Crear transacción con Transbank
    const response = await transaction.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    console.log('Transacción creada exitosamente:', {
      token: response.token,
      url: response.url
    });

    res.json({
      success: true,
      token: response.token,
      url: response.url
    });

  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear transacción',
      details: error.message
    });
  }
});

/**
 * POST /api/transbank/commit
 * Confirmar una transacción después del pago
 */
app.post('/api/transbank/commit', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token es requerido'
      });
    }

    console.log('Confirmando transacción con token:', token);

    // Confirmar transacción con Transbank
    const response = await transaction.commit(token);

    console.log('Transacción confirmada:', {
      buyOrder: response.buy_order,
      authorizationCode: response.authorization_code,
      status: response.status
    });

    res.json({
      success: true,
      data: {
        vci: response.vci,
        amount: response.amount,
        status: response.status,
        buyOrder: response.buy_order,
        sessionId: response.session_id,
        cardDetail: response.card_detail,
        accountingDate: response.accounting_date,
        transactionDate: response.transaction_date,
        authorizationCode: response.authorization_code,
        paymentTypeCode: response.payment_type_code,
        responseCode: response.response_code,
        installmentsNumber: response.installments_number
      }
    });

  } catch (error) {
    console.error('Error al confirmar transacción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al confirmar transacción',
      details: error.message
    });
  }
});

/**
 * GET /api/transbank/status/:token
 * Obtener estado de una transacción
 */
app.get('/api/transbank/status/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const response = await transaction.status(token);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error al obtener estado:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estado de transacción',
      details: error.message
    });
  }
});

/**
 * POST /api/transbank/refund
 * Procesar devolución
 */
app.post('/api/transbank/refund', async (req, res) => {
  try {
    const { token, amount } = req.body;

    if (!token || !amount) {
      return res.status(400).json({
        error: 'Token y amount son requeridos'
      });
    }

    const response = await transaction.refund(token, amount);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error al procesar devolución:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar devolución',
      details: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Transbank Proxy Server',
    environment: 'Integration',
    commerceCode: COMMERCE_CODE
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════');
  console.log('🚀 Servidor Transbank Proxy iniciado');
  console.log('═══════════════════════════════════════════════');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🏪 Commerce Code: ${COMMERCE_CODE}`);
  console.log(`🔧 Ambiente: INTEGRACIÓN (Pruebas)`);
  console.log('═══════════════════════════════════════════════');
  console.log('');
  console.log('Endpoints disponibles:');
  console.log(`  POST   /api/transbank/create`);
  console.log(`  POST   /api/transbank/commit`);
  console.log(`  GET    /api/transbank/status/:token`);
  console.log(`  POST   /api/transbank/refund`);
  console.log(`  GET    /health`);
  console.log('');
  console.log('✅ Listo para recibir peticiones del frontend');
  console.log('═══════════════════════════════════════════════');
});

export default app;

import dotenv from 'dotenv';
dotenv.config();

const MATON_API_KEY = process.env.MATON_API_KEY;
const LINKEDIN_VERSION = process.env.LINKEDIN_VERSION || '202506';
const MATON_GATEWAY_URL = process.env.MATON_GATEWAY_URL || 'https://gateway.maton.ai/linkedin';

async function testConnection() {
  console.log('=== Observatorio Tech Colombia - Test de Conexión Maton ===\n');

  if (!MATON_API_KEY || MATON_API_KEY.trim() === '') {
    console.error('❌ ERROR: MATON_API_KEY no está configurada.');
    console.log('\nPasos para configurarla:');
    console.log('1. Regístrate o inicia sesión en: https://maton.ai');
    console.log('2. Conecta tu cuenta de LinkedIn en: https://ctrl.maton.ai');
    console.log('3. Obtén tu API Key en: https://maton.ai/settings');
    console.log('4. Crea un archivo .env en la raíz del proyecto y añade:');
    console.log('   MATON_API_KEY=tu_clave_aqui');
    console.log('   LINKEDIN_VERSION=202506\n');
    process.exit(1);
  }

  console.log(`📡 URL Gateway: ${MATON_GATEWAY_URL}`);
  console.log(`🔑 API Key: ${MATON_API_KEY.slice(0, 4)}...${MATON_API_KEY.slice(-4)}`);
  console.log(`🔖 LinkedIn-Version: ${LINKEDIN_VERSION}\n`);

  try {
    const testEndpoint = `${MATON_GATEWAY_URL}/rest/me`;
    console.log(`Enviando petición a: ${testEndpoint} ...`);

    const response = await fetch(testEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MATON_API_KEY.trim()}`,
        'LinkedIn-Version': LINKEDIN_VERSION,
        'X-RestLi-Protocol-Version': '2.0.0',
        'Accept': 'application/json',
      },
    });

    console.log(`Status HTTP: ${response.status} ${response.statusText}`);
    const responseText = await response.text();

    try {
      const json = JSON.parse(responseText);
      console.log('\nRespuesta recibida (JSON):');
      console.dir(json, { depth: null, colors: true });

      if (response.ok) {
        console.log('\n Conexión con Maton -> LinkedIn establecida exitosamente.');
      } else {
        console.log('\n⚠️ El gateway respondió con error. Revisa el estado de la conexión en https://ctrl.maton.ai');
      }
    } catch {
      console.log('\nRespuesta recibida (Texto):', responseText);
    }
  } catch (error) {
    console.error('❌ Error en la conexión:', error);
  }
}

testConnection();

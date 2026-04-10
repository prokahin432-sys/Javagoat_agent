const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

// 🌟 SECURE FIREBASE URL FROM GITHUB SECRETS 🌟
const FIREBASE_URL = process.env.FIREBASE_URL;

const orderStates = {};

// Function to fetch the dynamic menu from your App
async function getMenuFromApp() {
  try {
    const response = await fetch(`${FIREBASE_URL}/`);
    const data = await response.json();
    if (!data) return [];

    // Convert Firebase object into an array (now includes image)
    return Object.keys(data).map(key => ({
      id: key,
      name: data[key].name,
      price: data[key].price,
      imageUrl: data[key].imageUrl
    }));
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    return [];
  }
}

async function startBot() {
  if (!FIREBASE_URL) {
    console.log("❌ ERROR: FIREBASE_URL is missing");
    process.exit(1);
  }

  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ["S", "K", "1"]
  });
}

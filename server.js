// server.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint para iniciar o pagamento com o PagBank
app.post('/api/checkout', async (req, res) => {
    const { amount } = req.body;

    // Dados de configuração do PagBank
    const pagbankConfig = {
        email: "felipe12oliveira1@gmail.com",
        token: "5aa389f1-657d-444a-9356-7a9b21598b4c1b7ff0a8465397048a221ae8efa913acec53-3fac-4578-b4ba-533b2d07597b",
        notificationURL: "https://seusite.com/notification"  // URL para notificações de pagamento (opcional)
    };

    // Dados do pedido a serem enviados para o PagBank
    const orderData = {
        amount: amount,
        currency: "BRL",
        description: "Compra em Floravix"
    };

    try {
        const response = await axios.post('https://ws.pagseguro.uol.com.br/v2/checkout', {
            ...pagbankConfig,
            ...orderData
        });

        // Extrair o código de checkout para redirecionar o usuário para o pagamento
        const paymentUrl = response.data.checkoutCode;
        res.json({ paymentUrl: `https://pagseguro.uol.com.br/v2/checkout/payment.html?code=${paymentUrl}` });
    } catch (error) {
        console.error('Erro ao iniciar pagamento:', error);
        res.status(500).json({ error: 'Erro ao iniciar pagamento com PagBank.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
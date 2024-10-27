// checkout.js

// Carregar itens do carrinho e exibir na página de checkout
document.addEventListener('DOMContentLoaded', function () {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');

    // Carregar o carrinho do localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <h4>${item.name}</h4>
            <p>Quantidade: ${item.quantity}</p>
            <p>Preço: R$ ${(item.price * item.quantity).toFixed(2)}</p>
        `;
        checkoutItemsContainer.appendChild(itemElement);
    });

    checkoutTotal.textContent = totalPrice.toFixed(2);

    // Configurar o botão de pagamento com PagBank
    document.getElementById('pay-with-pagbank').addEventListener('click', function () {
        initiatePagBankPayment(totalPrice);
    });
});

// Função para iniciar o pagamento com o PagBank
function initiatePagBankPayment(amount) {
    fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount })
    })
    .then(response => response.json())
    .then(data => {
        if (data.paymentUrl) {
            window.location.href = data.paymentUrl; // Redirecionar para o PagBank
        } else {
            alert('Erro ao iniciar o pagamento com PagBank.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}
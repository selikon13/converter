
const amountInput = document.getElementById('name');
const fromValue = document.getElementById('fromValue');
const toValue = document.getElementById('toValue');
const touchButton = document.getElementById('touch');
const modal = document.getElementById('myModal');


function validateInput(input) {
  let value = input.value;
  let newValue = value.replace(/[^0-9,]/g, '');
  if (value !== newValue) {
    input.value = newValue;
    document.getElementById('error-message').style.display = 'inline';
  } else {
    document.getElementById('error-message').style.display = 'none'; 
  }
}

async function getExchangeRate(fromCurrency, toCurrency) {
    try {
        const apiUrl = `${currencyApiUrl}?apikey=${apiKey}&base_currency=${fromCurrency}&currencies=${toCurrency}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        if (data.data && data.data[toCurrency]) {
            return data.data[toCurrency];
        } else {
            throw new Error('Unable to get exchange rate.');
        }
    } catch (error) {
        console.error('Error while getting exchange rate:', error);
        return null;
    }
}

async function convertAmount() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromValue.value;
    const toCurrency = toValue.value;

    if (isNaN(amount) || amount <= 0) {
        modalResult.textContent = 'Error: Please enter a valid amount';
        modal.style.display = 'block';
        return;
    }

    if (!fromCurrency || !toCurrency) {
        modalResult.textContent = 'Select currency';
        modal.style.display = 'block';
        return;
    }

    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);

    if (exchangeRate === null) {
        modalResult.textContent = 'Select the desired currency';
        modal.style.display = 'block';
        return;
    }

    const convertedAmount = amount * exchangeRate;
    modalResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    modal.style.display = 'block';
}

touchButton.addEventListener('click', convertAmount);

const closeBtn = document.querySelector('.close');

if (closeBtn) {
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});


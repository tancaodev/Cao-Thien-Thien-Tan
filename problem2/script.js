let currencyData = [];

async function fetchCurrencies() {
	const response = await fetch('https://interview.switcheo.com/prices.json');
	currencyData = await response.json();
	populateCurrencyOptions();
}

async function populateCurrencyOptions() {
	const fromSelect = document.getElementById('from-currency');
	const toSelect = document.getElementById('to-currency');

	currencyData.forEach((item) => {
		const imgUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/${item.currency}.svg`;

		const option1 = document.createElement('option');
		option1.value = item.currency;
		option1.innerHTML = `<span class='currency-option'>${item.currency}</span>`;

		const option2 = option1.cloneNode(true);

		fromSelect.appendChild(option1);
		toSelect.appendChild(option2);
	});

	fromSelect.value = 'USD';
	toSelect.value = currencyData[0].currency;

	updateOutputAmount();
}

async function updateOutputAmount() {
	const fromCurrency = document.getElementById('from-currency').value;
	const toCurrency = document.getElementById('to-currency').value;
	const amount =
		parseFloat(document.getElementById('input-amount').value) || 0;

	const fromRate =
		currencyData.find((item) => item.currency === fromCurrency)?.price || 1;
	const toRate =
		currencyData.find((item) => item.currency === toCurrency)?.price || 1;

	const convertedAmount = (amount * toRate) / fromRate;
	document.getElementById('output-amount').value = convertedAmount.toFixed(6);
}

document
	.getElementById('input-amount')
	.addEventListener('input', updateOutputAmount);
document
	.getElementById('from-currency')
	.addEventListener('change', updateOutputAmount);
document
	.getElementById('to-currency')
	.addEventListener('change', updateOutputAmount);

fetchCurrencies();

document.addEventListener('DOMContentLoaded', () => {
    const selectFrom = document.getElementById('currency-from');
    const selectTo = document.getElementById('currency-to');
    const flagFrom = document.getElementById('flag-from');
    const flagTo = document.getElementById('flag-to');
    const amountFrom = document.getElementById('amount-from');
    const amountTo = document.getElementById('amount-to');
    const rateInfo = document.getElementById('rate-info');
    const fromCurrencyName = document.getElementById('from-currency-name');
    const toCurrencyName = document.getElementById('to-currency-name');
    const swapBtn = document.getElementById('swap-btn');

    const currencyNames = {
        USDT: "United States Dollar",
        EUR: "Euro",
        GBP: "British Pound Sterling",
        JPY: "Japanese Yen",
        AUD: "Australian Dollar",
        CAD: "Canadian Dollar",
        CHF: "Swiss Franc",
        CNY: "Chinese Yuan",
        INR: "Indian Rupee",
        NZD: "New Zealand Dollar",
        MAD: "Moroccan Dirham",
        SAR: "Saudi Riyal",
        AED: "United Arab Emirates Dirham",
        QAR: "Qatari Riyal",
        KWD: "Kuwaiti Dinar",
        BHD: "Bahraini Dinar",
        OMR: "Omani Rial",
        EGP: "Egyptian Pound",
        ZAR: "South African Rand",

        
    };

    fetch('swap.json')
        .then(response => response.json())
        .then(data => {
            const rates = data.data;
            
            // Populate currency dropdowns
            Object.entries(rates).forEach(([currency, info]) => {
                [selectFrom, selectTo].forEach(select => {
                    const option = new Option(currency, info.value);
                    select.add(option);

                    console.log(selectTo);

                    
                    
                });
            });

            // Set default values
            selectFrom.value = rates.MAD.value;
            selectTo.value = rates.USDT.value;
            updateFlags();
            updateExchangeRate();
            updateCurrencyNames();

            // Event listeners
            selectFrom.addEventListener('change', () => {
                updateFlags();
                updateExchangeRate();
                updateCurrencyNames();
                convertCurrency();
            });

            selectTo.addEventListener('change', () => {
                updateFlags();
                updateExchangeRate();
                updateCurrencyNames();
                convertCurrency();
            });

            amountFrom.addEventListener('input', convertCurrency);

            swapBtn.addEventListener('click', () => {
                // Swap currency selections
                const tempValue = selectFrom.value;
                const tempText = selectFrom.options[selectFrom.selectedIndex].text;
                
                selectFrom.value = selectTo.value;
                selectTo.value = tempValue;

                // Swap amounts if they exist
                const tempAmount = amountFrom.value;
                amountFrom.value = amountTo.value;
                amountTo.value = tempAmount;

                // Update everything
                updateFlags();
                updateExchangeRate();
                updateCurrencyNames();
                convertCurrency();
            });
        });

    function updateFlags() {
        const getFlag = (select) => {
            const currency = select.options[select.selectedIndex].text;
            return `https://flagsapi.com/${currency.slice(0, 2)}/flat/64.png`;
        };

        flagFrom.src = getFlag(selectFrom);
        flagTo.src = getFlag(selectTo);
    }

    function updateCurrencyNames() {
        const fromCurrency = selectFrom.options[selectFrom.selectedIndex].text;
        const toCurrency = selectTo.options[selectTo.selectedIndex].text;
        
        fromCurrencyName.textContent = currencyNames[fromCurrency] || fromCurrency;
        toCurrencyName.textContent = currencyNames[toCurrency] || toCurrency;
    }

    function updateExchangeRate() {
        const fromRate = parseFloat(selectFrom.value);
        const toRate = parseFloat(selectTo.value);
        const rate = toRate / fromRate;
        const fromCurrency = selectFrom.options[selectFrom.selectedIndex].text;
        const toCurrency = selectTo.options[selectTo.selectedIndex].text;
        
        rateInfo.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    }

    function convertCurrency() {
        const amount = parseFloat(amountFrom.value) || 0;   
        const fromRate = parseFloat(selectFrom.value);
        const toRate = parseFloat(selectTo.value);
        const result = (amount / fromRate) * toRate;
        amountTo.value = result.toFixed(2);
    }
});

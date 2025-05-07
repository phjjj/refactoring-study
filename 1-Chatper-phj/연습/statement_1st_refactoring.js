function statement(invoice, plays) {
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;

    for (let perf of invoice.performances) {
        // 청구 내역을 출력한다.
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }
    result += `총액: ${usd(totalAmount())}\n`;
    result += `적립 포인트: ${totalVolumeCredits()}점\n`;

    return result;

    function totalAmount() {
        let result = 0;

        for (let perf of invoice.performances) {
            result = amountFor(perf);
        }
        return result;
    }

    function totalVolumeCredits() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += volumeCreditsFor(perf);
        }
        return result;
    }

    function usd(aNumber) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(aNumber / 100);
    }

    function volumeCreditsFor(performance) {
        let volumeCredits = 0;
        volumeCredits += Math.max(performance.audience - 30, 0);
        if ('comedy' === playFor(performance).type) volumeCredits += Math.floor(performance.audience / 5);
        return volumeCredits;
    }

    function playFor(performance) {
        return plays[performance.playID];
    }

    function amountFor(performance) {
        let thisAmount = 0;

        switch (playFor(performance).type) {
            case 'tragedy': // 비극
                thisAmount = 40000;
                if (performance.audience > 30) {
                    thisAmount += 1000 * (performance.audience - 30);
                }
                break;
            case 'comedy': // 희극
                thisAmount = 30000;
                if (performance.audience > 20) {
                    thisAmount += 10000 + 500 * (performance.audience - 20);
                }
                thisAmount += 300 * performance.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${play.type}`);
        }
        return thisAmount;
    }
}

// 테스트 데이터
const plays = {
    hamlet: { name: 'Hamlet', type: 'tragedy' },
    'as-like': { name: 'As You Like It', type: 'comedy' },
    othello: { name: 'Othello', type: 'tragedy' },
};

const invoices = [
    {
        customer: 'BigCo',
        performances: [
            {
                playID: 'hamlet',
                audience: 55,
            },
            {
                playID: 'as-like',
                audience: 35,
            },
            {
                playID: 'othello',
                audience: 40,
            },
        ],
    },
];

// 테스트 실행
console.log(statement(invoices[0], plays));

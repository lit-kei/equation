class Sqrt {
    constructor(value) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error("非負の整数を指定してください");
        }
        this.value = value;
        const { outside, inside } = this.simplify();
        this.outside = outside;
        this.inside = inside;
    }

    // 最大の平方数で割って簡単化する
    simplify() {
        if (this.value == 0) { return { outside: 0, inside: 1 };}
        let n = this.value;
        let outside = 1;
        let inside = n;

        // n をできるだけ大きな平方数で割る
        for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
            if (n % (i * i) === 0) {
                outside = i;
                inside = n / (i * i);
                break;
            }
        }

        return { outside, inside };
    }

    toString() {
        if (this.inside === 1) {
            return `${this.outside}`; // 例えば sqrt(9) → "3"
        } else if (this.outside === 1) {
            return `\\sqrt{${this.inside}}`; // 例えば sqrt(3) → "√3"
        } else {
            return `${this.outside}\\sqrt{${this.inside}}`; // 例えば sqrt(12) → "2√3"
        }
    }
}
class Fraction {
    constructor(numerator, denominator) {
        if (denominator === 0) {
            throw new Error("分母は0にできません");
        }
        this.numerator = numerator;
        this.denominator = denominator;
        this.simplify();
    }

    // 分数を簡約化するメソッド
    simplify() {
        const gcd = this.greatestCommonDivisor(this.numerator, this.denominator);
        this.numerator /= gcd;
        this.denominator /= gcd;

        // 分母が負の場合、分子と分母を反転する
        if (this.denominator < 0) {
            this.numerator = -this.numerator;
            this.denominator = -this.denominator;
        }
    }

    // 最大公約数を求めるメソッド
    greatestCommonDivisor(a, b) {
        return b === 0 ? Math.abs(a) : this.greatestCommonDivisor(b, a % b);
    }

    // 分数の加算
    add(fraction) {
        const newNumerator = this.numerator * fraction.denominator + fraction.numerator * this.denominator;
        const newDenominator = this.denominator * fraction.denominator;
        return new Fraction(newNumerator, newDenominator);
    }

    // 分数の減算
    subtract(fraction) {
        const newNumerator = this.numerator * fraction.denominator - fraction.numerator * this.denominator;
        const newDenominator = this.denominator * fraction.denominator;
        return new Fraction(newNumerator, newDenominator);
    }

    // 分数の乗算
    multiply(fraction) {
        const newNumerator = this.numerator * fraction.numerator;
        const newDenominator = this.denominator * fraction.denominator;
        return new Fraction(newNumerator, newDenominator);
    }

    // 分数の除算
    divide(fraction) {
        if (fraction.numerator === 0) {
            throw new Error("ゼロで割ることはできません");
        }
        const newNumerator = this.numerator * fraction.denominator;
        const newDenominator = this.denominator * fraction.numerator;
        return new Fraction(newNumerator, newDenominator);
    }

    equal(fraction) {
        const thisFraction = new Fraction(this.numerator, this.denominator);
        const otherFraction = new Fraction(fraction.numerator, fraction.denominator);
    
        return thisFraction.numerator === otherFraction.numerator && 
               thisFraction.denominator === otherFraction.denominator;
    }

    // 分数を文字列として表示
    toString() {
        if (this.denominator === 1) return `${this.numerator}`;
        if (this.numerator === 0) return "0";
        if (this.denominator * this.numerator < 0) {
            return `-\\frac{${Math.abs(this.numerator)}}{${Math.abs(this.denominator)}}`;
        }
        return `\\frac{${this.numerator}}{${this.denominator}}`;
    }
}
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}




const toggle = document.getElementById('toggle');
const OnOff = document.getElementById('on-off');
const states = {
    start: 0,
    question: 1,
    answer: 2
};
const formulas = {
    solution: "$ x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a} $"
}
const max = [5, 9, 9];
let state = states.start;
let txt = "";
let answerTxt = "";
let guideTxt = "";
let factorizationFlag = false;
let last = [];
const formatter = new Intl.NumberFormat("en-US", { signDisplay: "always" });

function questionSet(flag) {
    txt = '$';
    if (flag) {
        let alpha;
        let beta;
        do {
            alpha = Math.floor(Math.random() * 11) - 5;
            beta = Math.floor(Math.random() * 11) - 5;
        } while ((last[0] === alpha && last[1] === beta) || (last[1] === alpha && last[0] === beta))
        last = [alpha, beta];
        txt += 'x^2';
        if (alpha + beta > 0) {
            if (alpha + beta == 1) { txt += `-x`; }
            else {txt += `${(alpha + beta) * -1}x`; }
        } else if (alpha + beta < 0) {
            if (alpha + beta == -1) { txt += `+x`; }
            else {txt += `+${(alpha + beta) * -1}x`; }
        }
        if (alpha * beta > 0) {
            txt += `+${alpha * beta}=0`;
        } else if (alpha * beta < 0) {
            txt += `${alpha * beta}=0`;
        } else {
            txt += '=0';
        }
        txt += '$';
        if (alpha == beta) {
            answerTxt = `$x=${alpha}$`;
            if (alpha == 0) {
                guideTxt = "自明";
            } else {
                guideTxt = `$(x ${formatter.format(alpha * -1)})^2=0$ より`;
            }
        } else {
            answerTxt = `$x=${[alpha,beta].sort((a,b) => a - b).join(',')}$`;
            if (alpha == 0 || beta == 0) {
                guideTxt = alpha == 0 ? `$x(x ${formatter.format(beta * -1)})=0$ より` : `$x(x ${formatter.format(alpha * -1)})=0$ より`;
            } else {
                guideTxt = alpha < beta ? `$(x ${formatter.format(alpha * -1)})(x ${formatter.format(beta * -1)})=0$ より` : `$(x ${formatter.format(beta * -1)})(x ${formatter.format(alpha * -1)})=0$ より`;
            }
        }
        
    } else {
        let a;
        let b;
        let c;
        let D;
        do {
            a = Math.floor(Math.random() * 3) + 1;
            b = Math.floor(Math.random() * 11) - 5;
            c = Math.floor(Math.random() * 17) - 8;
            D = b * b - 4 * a * c;
        } while (D <= 0 || a == 0 || (last[0] == a && last[1] == b && last[2] == c));
        last = [a,b,c];
        txt = `$ ${a == 1 ? "" : a}x^2`;
        if (b > 0) {
            txt += `+${b == 1 ? "" : b}x`;
        } else if (b != 0) {
            txt += `${b == 1 ? "-" : b}x`;
        }
        txt += `${c == 0 ? "" : formatter.format(c)} = 0 $`;
        const sqrt = new Sqrt(D);
        let divide = gcd(gcd(sqrt.outside, b), 2 * a);
        b /= divide;
        sqrt.outside /= divide;
        sqrt.value /= (divide * divide);
        if (sqrt.inside == 1) {
            let alpha = new Fraction(-b + sqrt.outside, 2 * a / divide);
            let beta = new Fraction(-b - sqrt.outside, 2 * a / divide);
            answerTxt = `$ x = ${beta.toString()},${alpha.toString()} $`;
        } else {
            if (2 * a / divide == 1) {
                answerTxt = `$ x =${b == 0 ? "" : -b}\\pm ${sqrt.toString()}$`;
            } else {
                if (b == 0) {
                    answerTxt = `$ x = \\pm\\frac{${sqrt.toString()}}{${2 * a / divide}} $`;
                } else {
                    answerTxt = `$ x = \\frac{${-b}\\pm ${sqrt.toString()}}{${2 * a / divide}} $`;
                }
            }
        }
        guideTxt = `解の公式 ${formulas.solution} より $\\;\\frac{-${last[1] < 0 ? `(${last[1]})` : last[1]} \\pm \\sqrt{${last[1] < 0 ? `(${last[1]})` : last[1]}^2 - 4 \\times ${a} \\times ${c < 0 ? `(${c})` : c}}}{2\\times${a}} $ `
        
        

    }
}

function init() {
    guideTxt = "";
    answerTxt = "";
    document.getElementById('guide').innerHTML = "&#x00A0";
    document.getElementById('answer').innerHTML = "&#x00A0";
    questionSet(toggle.checked);




    document.getElementById('question').textContent = txt;





    
}

function next() {
    switch (state) {
        case states.start:
            init();
            document.getElementById('button').textContent = '答え合わせ';
            state = states.question;
            break;
        case states.question:
            //解説表示
            document.getElementById('answer').textContent = answerTxt;
            document.getElementById('guide').innerHTML = guideTxt;
            state = states.answer;
            document.getElementById('button').textContent = '次の問題';
            break;
        case states.answer:
            //解説削除

            init();
            document.getElementById('button').textContent = '答え合わせ';
            state = states.question;
            break;
    
        default:
            break;
    }
    MathJax.typeset();
}

window.addEventListener('keydown', next);

document.getElementById('button').addEventListener('click', () => {
    next();
});

document.getElementById('formula').addEventListener('click', () => {
    if (toggle.checked) {
        toggle.checked = false;
    }
});
document.getElementById('factorization').addEventListener('click', () => {
    if (!toggle.checked) {
        toggle.checked = true;
    }
});
OnOff.addEventListener('change', () => {
    if (OnOff.checked) {
        document.getElementById('toggle-label').textContent = 'On';
        document.getElementById('guide').style.display = 'block';
    } else {
        document.getElementById('toggle-label').textContent = 'Off';
        document.getElementById('guide').style.display = 'none';
    }
});
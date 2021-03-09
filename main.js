const app = Vue.createApp({
    data() {
        return {
            number: 50,
            range: 10,
            randomValues: [],
            realMu: 0.3,
        }
    },
    computed: {
        m: function() {
            return math.sum(this.randomValues.slice(0,this.range));
        }
    },
    watch: {
        number: function(value) {
            const intValue = parseInt(value);

            if (isNaN(intValue)) {
                return
            }

            if (intValue <= 0) {
                return
            }

            this.generateRandomValues();
            this.draw();
        },
        range: function() {
            this.draw();
        },
        realMu: function() {
            this.generateRandomValues();
            this.draw();
        }
    },
    methods: {
        draw() {
            try {
                const beta_mu_p_q = '(mu^(p-1))*((1-mu)^(q-1))*factorial(p+q-1)/(factorial(p-1)*factorial(q-1))';
                // compile the expression once
                const expr = math.compile(beta_mu_p_q)
                const p = 1 + this.m;
                const q = 1 + (this.range - this.m);

                // evaluate the expression repeatedly for different values of x
                const xValues = math.range(0, 1, 0.01).toArray()
                const yValues = xValues.map(function (x) {
                    return expr.evaluate({
                        mu: x,
                        p: p,
                        q: q,
                    })
                });

                // render the plot using plotly
                const trace = {
                    x: xValues,
                    y: yValues,
                    name: 'posterior density',
                    mode: 'lines',
                    type: 'scatter'
                }

                const beta_mean = {
                    x: [p/(p+q)],
                    y: [0],
                    name: 'posterior mean',
                    mode: 'markers',
                    type: 'scatter'
                }

                const real_mean = {
                    x: [this.realMu],
                    y: [0],
                    name: 'real mean',
                    mode: 'markers',
                    type: 'scatter'
                }

                const data = [trace, beta_mean, real_mean]
                Plotly.newPlot('plot', data)
            }
            catch (err) {
                console.error(err)
                alert(err)
            }
        },
        generateRandomValues() {
            const randomArray = math.random([this.number]);
            this.randomValues = randomArray.map(el => (el < this.realMu ? 1 : 0));
        }
    },
    created() {
        this.generateRandomValues();
    },
    mounted() {
        this.draw();
    }
})
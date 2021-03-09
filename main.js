const app = Vue.createApp({
    data() {
        return {
            number: 200,
            range: 20,
            randomValues: [],
            realMu: 0.3,
            alpha: 1,
            beta: 1,
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
        },
        alpha: function() {
            this.draw();
        },
        beta: function() {
            this.draw();
        }
    },
    methods: {
        draw() {
            try {
                const beta_mu_p_q = '(mu^(p-1))*((1-mu)^(q-1))*combinations(p+q,p)*p*q/(p+q)';
                // compile the expression once
                const expr = math.compile(beta_mu_p_q)
                const p = this.alpha + this.m;
                const q = this.beta + (this.range - this.m);

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
        },
        newExperiment() {
            this.generateRandomValues();
            this.draw();
        },
        resetExperiment() {
            this.range = 20;
            this.realMu = 0.3;
            this.alpha = 1;
            this.beta = 1;
            this.generateRandomValues();
            this.draw();
        }
    },
    created() {
        this.generateRandomValues();
    },
    mounted() {
        this.draw();
    }
})
# Bayesian statistics

**Merged into the node.js based repository [inys/bayesian-statistics](https://github.com/inys/bayesian-statistics)!**

The topic of this is the experiment of tossing an unfair coin for several times and deducing information on the real value of the parameter.

- The "Real μ" describes the real probability to observe "0".
- The "Number of samples" counts how often we toss the coin.

Below we can see the outcome of the experiment and a graph of the posterior distribution and the posterior mean. We have used Beta(1,1) as prior distribution.

## Installation

Clone the directory and start a local HTTP-Server. Using for example
```
python -m http.server 8080
```

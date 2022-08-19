module SurvivalAnalysis

    using DataFrames
    using Distributions
    using LinearAlgebra: diag
    using NLSolversBase: hessian!
    using Optim
    using RecipesBase
    using StatsBase
    using StatsModels

    # reexports
    export DataFrame # DataFrames
    export scale, shape, params, Exponential, Weibull # Distributions
    export coef, confint, stderror, vcov, predict, fit, fit!, std # StatsBase
    export @formula # StatsModels
    export time # Base

    # other exports
    export Surv, outcome_times, event_times, outcome_status, unique_times
    export unique_event_times
    export total_events, total_censored, total_outcomes, total_risk, surv_stats
    export Srv
    export kaplan_meier, nelson_aalen, ph, aft, KaplanMeier, NelsonAalen
    export survival, distribution
    export ParametricPH, ParametricAFT
    export baseline
    export survival, hazard, cum_hazard, Fₜ, fₜ, pₜ, Sₜ, hₜ, Hₜ
    export SurvivalPrediction

    include("utils.jl")
    include("tools.jl")
    include("Surv.jl")
    include("SurvTerm.jl")
    include("SurvivalModel.jl")
    include("SurvivalPrediction.jl")
    include("ContinuousPHDistribution.jl")
    include("ContinuousAFTDistribution.jl")
    include("ParametricSurvival.jl")
    include("ParametricAFT.jl")
    include("ParametricPH.jl")
    include("SurvivalEstimator.jl")
    include("KaplanMeier.jl")
    include("NelsonAalen.jl")
    include("plot_survivalestimator.jl")
end

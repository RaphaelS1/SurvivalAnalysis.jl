module SurvivalAnalysis

    using RecipesBase
    using LinearAlgebra: diag
    using Optim
    using NLSolversBase: hessian!

    using DataFrames
    export DataFrame

    using StatsModels
    export @formula, terms, coefnames

    using StatsBase
    export coef, confint, stderror, vcov, predict, fit, fit!

    using Distributions
    export scale, shape, Exponential, Weibull

    export
        Surv,
        Srv,
        outcomeTimes,
        eventTimes,
        outcomeStatus,
        uniqueTimes,
        uniqueEventTimes,
        totalEvents,
        totalCensored,
        totalOutcomes,
        totalRisk,
        survStats,
        kaplan,
        nelson,
        ParametricPH,
        ParametricAFT,
        ph,
        aft

    include("utils.jl")
    include("Surv.jl")
    include("SurvTerm.jl")
    include("SurvivalModel.jl")
    include("SurvivalPrediction.jl")
    include("ContinuousPHDistribution.jl")
    include("ContinuousAFTDistribution.jl")
    include("FittedParametric.jl")
    include("FittedParametricAFT.jl")
    include("FittedParametricPH.jl")
    include("NonParametricEstimator.jl")
    include("KaplanMeier.jl")
    include("NelsonAalen.jl")

end

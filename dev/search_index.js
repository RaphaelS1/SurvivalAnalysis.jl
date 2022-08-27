var documenterSearchIndex = {"docs":
[{"location":"api/#API","page":"API","title":"API","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"DocTestSetup = quote\n    using DataFrames, Distributions, SurvivalAnalysis\nend","category":"page"},{"location":"api/#Modules","page":"API","title":"Modules","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Modules = [SurvivalAnalysis]\nOrder   = [:module]","category":"page"},{"location":"api/#Types","page":"API","title":"Types","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Modules = [SurvivalAnalysis]\nOrder   = [:type]","category":"page"},{"location":"api/#SurvivalAnalysis.ConcordanceWeights","page":"API","title":"SurvivalAnalysis.ConcordanceWeights","text":"ConcordanceWeights(S::Int8, G::Int8, tied_preds::Float64 tied_times::Float64)\n\nWeights used in the concordance function. S and G reflect the power applied to the Kaplan-Meier estimates of the survival and censoring distributions of the fitted data used to apply weighting at a given time. For example ConcordanceWeights(1, -2, 0.5, 0.5) will tell the concordance function to multiply concordant pairs at time t by S(t)/G(t)². tied_preds and tied_times determine how to handle ties in predictions and observed times respectively.\n\nSee concordance for full examples.\n\nNote❗  It is strongly recommended that S ≥ 0 and G ≤ 0.\n\n\n\n\n\n","category":"type"},{"location":"api/#SurvivalAnalysis.Surv-Tuple{Union{Vector{T}, T} where T<:Number, Union{Vector{T}, T} where T<:Number}","page":"API","title":"SurvivalAnalysis.Surv","text":"Surv(start, stop)\nSurv(time)\nSurv(time, status, type)\n\nThis is the entry point object into survival modelling.\n\n\n\n\n\n","category":"method"},{"location":"api/#SurvivalAnalysis.SurvivalModel","page":"API","title":"SurvivalAnalysis.SurvivalModel","text":"SurvivalModel\n\nAbstract type for all models implemented in, or extending, this package. Type 'inherits'\n\nfrom JuliaStats.StatisticalModel to enable formula fitting and predicting interface.\n\n\n\n\n\n","category":"type"},{"location":"api/#SurvivalAnalysis.SurvivalPrediction-Union{Tuple{}, Tuple{T}} where T<:Number","page":"API","title":"SurvivalAnalysis.SurvivalPrediction","text":"SurvivalPrediction(;\n    distr::Union{Nothing, Vector{<:Distribution}} = nothing,\n    lp::Union{Nothing, Vector{T}}  = nothing,\n    crank::Union{Nothing, Vector{T}} = nothing,\n    time::Union{Nothing, Vector{T}} = nothing,\n    fit_times::Union{Nothing, Vector{T}} = nothing,\n    survival_matrix::Union{Matrix{T}, Nothing} = nothing\n    ) where {T<:Number}\n\nSurvival models can make multiple types of predictions including:\n\ndistr - A survival time distribution (implemented with Distributions.jl)\nlp - A linear predictor (usually Xβ, i.e. covariates * fitted coefficients)\ncrank - A generic continuous relative risk ranking\ntime - A survival time\nsurvival_matrix - A matrix of predicted survival probabilities where rows are\n\nobservations and columns are fitted survival times corresponding to fit_times.\n\nThese predictions can only exist in a finite number of combinations so they are aggregated in types within this package (and automatically determined within this function):\n\nDeterministicSurvivalPrediction(lp, crank, time)\nDiscreteSurvivalPrediction(distr, lp, crank, time, survival_matrix)\nContinuousSurvivalPrediction(distr, lp, crank, time)\n\nAbsolutely no transformations take require assumptions take place within this function but it does transform survival_matrix to a Distributions.DiscreteNonParametric and vice versa.\n\nExamples\n\njulia> SurvivalPrediction(time = randn(5)); # DeterministicSurvivalPrediction\n\njulia> SurvivalPrediction(fit_times = randn(5), survival_matrix = randn((2, 5))); # DiscreteSurvivalPrediction\n\njulia> SurvivalPrediction(distr = fill(Exponential(), 2)); # ContinuousSurvivalPrediction\n\n\n\n\n\n","category":"method"},{"location":"api/#Functions","page":"API","title":"Functions","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Modules = [SurvivalAnalysis]\nOrder   = [:function]","category":"page"},{"location":"api/#RecipesBase.apply_recipe","page":"API","title":"RecipesBase.apply_recipe","text":"plot(npe::SurvivalEstimator, plot_confint::Bool = true; level = 0.95)\nplot(npe::StatsModels.TableStatisticalModel{KaplanMeier, Matrix{Float64}},\n    plot_confint::Bool = true; level = 0.95)\n\nRecipe for plotting fitted non-parametric estimators, `npe`. If `plot_confint` then\nconfidence intervals also plotted at a `level`% confidence level.\n\n# Examples\n```jldoctest\njulia> using Plots\n\njulia> data = DataFrame(t = randn(10), d = [trues(5)..., falses(5)...]);\n\njulia> plot(kaplan_meier(@formula(Srv(t, d) ~ 1), data));\n\njulia> plot(nelson_aalen(@formula(Srv(t, d) ~ 1), data).model);\n```\n\n\n\n\n\n","category":"function"},{"location":"api/#SurvivalAnalysis.Srv","page":"API","title":"SurvivalAnalysis.Srv","text":"Srv(T::Symbol, Δ::Symbol, type::Int = 1)\n\nCreate a `SurvTerm` object for internal use for fitting models. Arguments, `T` and `Δ`\nshould be a reference to the name of the time and status variables in a `DataFrame`\nrespectively. `type` should be `1` (or omitted) for right-censoring or `-1`\nfor left-censoring.\n\n# Examples\n```jldoctest\njulia> using DataFrames\n\njulia> data = DataFrame(t = [1, 2, 3], d = [1, 0, 0])\n\njulia> @formula(Srv(t, d) ~ 1)\nFormulaTerm\nResponse:\n(t,d)->Srv(t, d)\nPredictors:\n1\n\njulia> Srv(t, d, -1)\nResponse:\n(t,d)->Srv(t, d, -1)\nPredictors:\n1\n```\n\n\n\n\n\n","category":"function"},{"location":"api/#SurvivalAnalysis.concordance","page":"API","title":"SurvivalAnalysis.concordance","text":"concordance(\n    truth::OneSidedSurv, prediction::Vector{<:Number}, weights::Union{Symbol, ConcordanceWeights};\n    tied_preds=0.5, tied_times=0, cutoff=nothing, train::OneSidedSurv=nothing, rev=false\n)\ncindex(\n    truth::OneSidedSurv, prediction::Vector{<:Number}, weights::Union{Symbol, ConcordanceWeights};\n    tied_preds=0.5, tied_times=0, cutoff=nothing, train::OneSidedSurv=nothing, rev=false\n)\n\nGeneric function to call any concordance index method. Concordance is a measure of discrimination which evaluates if a prediction is concordant with the truth, i.e. let Tᵢ,Tⱼ be the true survival times, truth, for observations i and j and let  ϕᵢ, ϕⱼ be predictions, prediction, then these are concordant if ϕᵢ  ϕⱼ  Tᵢ  Tⱼ.\n\nIn survival analysis the generic C-index is defined as follows\n\nC = fracsum_ij W(tᵢ)I(tᵢ  tⱼ yᵢ  yⱼ tᵢ  τ)δᵢW(tᵢ)I(tᵢ  tⱼ tᵢ  τ)δᵢ\n\nwhere tᵢ,tⱼ are true survival times, yᵢ,yⱼ are predictions, τ is a cutoff time used to ensure stability even when censoring is high, δᵢ is the censoring indicator and W is a weighting function determined by weights as follows:\n\n* `:I` or `:Harrell` - Harrell's C - ``W(tᵢ) = 1``\n* `:G2` or `:Uno` - Uno's C - ``W(tᵢ) = 1/G(tᵢ)``\n* `:SG` or `:Schemper` - Schemper's C - ``W(tᵢ) = S(tᵢ)/G(tᵢ)``\n* `:S` or `:Peto` - Peto-Wilcoxon's C - ``W(tᵢ) = S(tᵢ)``\n\nwhere S(tᵢ) and G(tᵢ) are respectively the Kaplan-Meier estimates of the survival and censoring distributions of the training data at time tᵢ. For any other combination of weights pass a ConcordanceWeights object to weights. Note❗ If training data is not provided to train then truth is used to estimate S and G but it is strongly recommended to provide the training data if possibe.\n\nWe also include an implementation of Gönen-Heller's C with weights = :GH or :Gonen. Note❗ this is actually a very different method from the others and calculates concordance for predictions from a Cox PH model only. We may move this to its own function in the future to avoid misuse.\n\nThere is open debate about how to handle ties when calculating the concordance. Ties can occur in predictions and in the observed survival times. The defaults here tied_preds=0.5 and tied_times=0 are set as these seem to be the most common but they can be changed. Note❗ If you pass a ConcordanceWeights object then the tied weights specified in this will take priority.\n\nNote❗ For predictions from PH models or any model where the prediction represents a relative risk then a higher value of ϕ implies a higher risk of event which will result in a lower survival time. In this case a prediction is concordant with the survival time if ϕᵢ  ϕⱼ  Tᵢ  Tⱼ. To do this within the function just set rev=true.\n\njulia> T = [1.0,0.1,pi,0.9,0.4,20,1,5,9,2.5];\n\njulia> ϕ = [0.1,0.2,0.1,0.9,0.25,exp(2),8,log(9),2,8];\n\njulia> Δ = [true,true,false,true,true,false,true,false,true,true];\n\njulia> Y = Surv(T, Δ, :r);\n\njulia> train = Surv([3,3,9,12,2,1,8,4,10,8], Δ, :r);\n\njulia> concordance(Y, ϕ, cutoff = threshold_risk(Y, 0.8)) # Harrell's C cutoff when 80% data is censored or dead\nSurvivalAnalysis.Concordance\n\nHarrell's C = 0.6153846153846154\n\nCutoff: T ≤ 9.0\nCounts:\n Pairs  Comparable  Concordant  Disconcordant\n    90          39          23             14\nWeights:\n IPCW  Tied preds  Tied times\n    1         0.5         0.0\nTies:\n Times  Preds  Both\n     1      2     0\nWeighted calculation:\n Numerator  Denominator         C\n      24.0         39.0  0.615385\n\njulia> concordance(Y, ϕ, :Uno, train=train) # Uno's C\nSurvivalAnalysis.Concordance\n\nUno's C = 0.6221374045801525\n\nCutoff: T ≤ 20.0\nCounts:\n Pairs  Comparable  Concordant  Disconcordant\n    90          39          23             14\nWeights:\n IPCW  Tied preds  Tied times\n 1/G²         0.5         0.0\nTies:\n Times  Preds  Both\n     1      2     0\nWeighted calculation:\n Numerator  Denominator         C\n   28.1728       45.284  0.622137\n\njulia> cindex(Y, ϕ, ConcordanceWeights(5, -3, 0.5, 0.5, \"Silly Weights\"); train=train) # Custom weights\nSurvivalAnalysis.Concordance\n\nSilly Weights C = 0.6070334788405888\n\nCutoff: T ≤ 20.0\nCounts:\n Pairs  Comparable  Concordant  Disconcordant\n    90          40          23             14\nWeights:\n  IPCW  Tied preds  Tied times\n S⁵/G³         0.5         0.5\nTies:\n Times  Preds  Both\n     1      2     0\nWeighted calculation:\n Numerator  Denominator         C\n   25.6265       42.216  0.607033\n\n\n\n\n\n","category":"function"},{"location":"api/#SurvivalAnalysis.cum_hazard-Tuple{UnivariateDistribution{S} where S<:ValueSupport, Real}","page":"API","title":"SurvivalAnalysis.cum_hazard","text":"cum_hazard(d::UnivariateDistribution, x::Real)\nHₜ(d::UnivariateDistribution, x::Real)\n\nCompute the cumulative hazard function of distribution d at point x.\n\nThe cumulative hazard function for random variable t is defined as\n\nH_t(x) = int^x_0 h_t(u) du = -log(S_t(x))\n\nwhere hₜ is the hazard function of t and Sₜ is the survival function of t.\n\nExamples\n\njulia> using Distributions\n\njulia> cum_hazard(Binomial(5, 0.5), 3)\n1.6739764335716711\n\n\n\n\n\n","category":"method"},{"location":"api/#SurvivalAnalysis.hazard-Tuple{UnivariateDistribution{S} where S<:ValueSupport, Real}","page":"API","title":"SurvivalAnalysis.hazard","text":"hazard(d::UnivariateDistribution, x::Real)\nhₜ(d::UnivariateDistribution, x::Real)\n\nCompute the hazard function of distribution d at point x.\n\nThe hazard function for random variable t is defined as\n\nh_t(x) = fracf_t(x)S_t(x)\n\nwhere fₜ is the pdf of t and Sₜ is the survival function of t.\n\nExamples\n\njulia> using Distributions\n\njulia> hazard(Binomial(5, 0.5), 3)\n1.6666666666666679\n\n\n\n\n\n","category":"method"},{"location":"api/#Macros-and-Constants","page":"API","title":"Macros and Constants","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Modules = [SurvivalAnalysis]\nOrder   = [:macro, :constant]","category":"page"},{"location":"examples/#Examples","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"DocTestSetup = quote\n    using DataFrames, Distributions, SurvivalAnalysis, Random\nend","category":"page"},{"location":"examples/#Fitting","page":"Examples","title":"Fitting","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"Models can be fit in one of four ways but we only recommend the first.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"julia> data = DataFrame(Y = [1,1,4,6,8,4,9,4,5,10], D = [true, false, false, false, true, false, false, true, true, false])\n10×2 DataFrame\n Row │ Y      D\n     │ Int64  Bool\n─────┼──────────────\n   1 │     1   true\n   2 │     1  false\n   3 │     4  false\n   4 │     6  false\n   5 │     8   true\n   6 │     4  false\n   7 │     9  false\n   8 │     4   true\n   9 │     5   true\n  10 │    10  false","category":"page"},{"location":"examples/#.-Function-Formula","page":"Examples","title":"1. Function + Formula","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"julia> f = kaplan_meier(@formula(Srv(Y, D) ~ 1), data)\nStatsModels.TableStatisticalModel{KaplanMeier, Matrix{Float64}}\n\n(Y,D;+) ~ 1\n\nCoefficients:\n  n  ncens  nevents\n 10      6        4","category":"page"},{"location":"examples/#.-fit-Formula","page":"Examples","title":"2. fit + Formula","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"julia>  f = fit(KaplanMeier, @formula(Srv(Y, D) ~ 1), data)\nStatsModels.TableStatisticalModel{KaplanMeier, Matrix{Float64}}\n\n(Y,D;+) ~ 1\n\nCoefficients:\n  n  ncens  nevents\n 10      6        4","category":"page"},{"location":"examples/#.-Function-Data","page":"Examples","title":"3. Function + Data","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"julia> f = kaplan_meier(hcat(ones(10), 1:10), Surv(data.Y, data.D, :r))\nKaplanMeier\n\nCoefficients:\n  n  ncens  nevents\n 10      6        4","category":"page"},{"location":"examples/#.-fit-Data","page":"Examples","title":"4. fit + Data","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"julia> f = fit(KaplanMeier, hcat(ones(10), 1:10), Surv(data.Y, data.D, :right))\nKaplanMeier\n\nCoefficients:\n  n  ncens  nevents\n 10      6        4","category":"page"},{"location":"examples/#Predicting","page":"Examples","title":"Predicting","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"If fitting method (1) or (2) are selected then new data must be given as a DataFrame, otherwise a Matrix is sufficient. We strongly recommend the formula method as this ensures the same covariates and predictors are used in fitting and predicting.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"julia> f = kaplan_meier(@formula(Srv(Y, D) ~ 1), data);\n\njulia> predict(f, DataFrame(Y = randn(10), D = trues(10)));","category":"page"},{"location":"#SurvivalAnalysis.jl-Manual","page":"Home","title":"SurvivalAnalysis.jl Manual","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Survival analysis in Julia.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Install the latest version from JuliaRegistries with","category":"page"},{"location":"","page":"Home","title":"Home","text":"Pkg.add(\"SurvivalAnalysis\")","category":"page"},{"location":"","page":"Home","title":"Home","text":"Or install the latest stable version from GitHub with","category":"page"},{"location":"","page":"Home","title":"Home","text":"Pkg.add(url=\"https://github.com/RaphaelS1/SurvivalAnalysis.jl.git\")","category":"page"},{"location":"#Package-Features","page":"Home","title":"Package Features","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Parametric models\nSemi-parametric models\nNonparametric estimators","category":"page"},{"location":"#Upcoming-features","page":"Home","title":"Upcoming features","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Bayesian methods\nSurvival metrics (discrimination, calibration, scoring rules)","category":"page"}]
}

abstract type SurvivalEstimator <: StatisticalModel end

function StatsBase.fit(
    obj::Type{<:SurvivalEstimator}, X::AbstractMatrix{<:Real}, Y::RCSurv)
    # TODO - need to add something here to check if rhs is intercept only or stratified
    #  currently stratified not supported
    return fit!(obj(), Y)
end

StatsBase.fit(obj::Type{<:SurvivalEstimator}, Y::RCSurv) = fit!(obj(), Y)

StatsBase.predict(fit::SurvivalEstimator, data::DataFrame; kwargs...) =
    predict(fit, Matrix(data); kwargs...)

function StatsBase.predict(fit::SurvivalEstimator, X::AbstractMatrix{<:Real})
    # TODO - need to add something here to check if rhs is intercept only or stratified
    #  currently stratified not supported
    n = size(X, 1)
    return SurvivalPrediction(
        distr = fill(fit.distribution, n),
        fit_times = fit.time,
        survival_matrix = repeat(fit.survival', n)
    )
end

function StatsModels.predict(
    mm::StatsModels.TableStatisticalModel{<:SurvivalEstimator, <:AbstractMatrix}, data;
    kwargs...
)
    Tables.istable(data) ||
        throw(ArgumentError("expected data in a Table, got $(typeof(data))"))

    f = mm.mf.f
    if f.rhs isa MatrixTerm{Tuple{InterceptTerm{true}}}
        new_x = reshape(data[!,1], :, 1) # pick an arbitrary column - only care about size
    else
        cols, nonmissings = StatsModels.missing_omit(StatsModels.columntable(data), f.rhs)
        new_x = modelcols(f.rhs, cols)
        new_x = reshape(new_x, size(new_x, 1), :)[:,2:end] # remove intercept
    end
    return predict(mm.model, new_x; kwargs...)
end


function _fit_npe(obj::SurvivalEstimator, Surv::RCSurv, point_est::Function,
    var_est::Function, surv_trafo::Function, std_trafo::Function)
    stats = surv_stats(Surv, events_only = true)
    n = length(stats.time)
    p = zeros(n)
    v = zeros(n)
    for (i, t) in enumerate(stats.time)
        p[i] = point_est(stats.nevents[i], stats.nrisk[i])
        v[i] = var_est(stats.nevents[i], stats.nrisk[i])
    end

    obj.survival = surv_trafo(p)
    obj.time = stats.time
    # for both NPEs variance calculated as plug-in
    obj.std = [0, std_trafo(cumsum(v), obj.survival)...]
    # calculate pmf and create distribution - Set S(0) = 1
    pₓ = [0, abs.(diff(obj.survival))...]
    obj.distribution = DiscreteNonParametric([0, stats.time...],  pₓ, check_args = false)

    return obj
end

# Calculates confidence intervals using the method of Kalbfleisch and Prentice (1980)
function _confint_npe(npe, t, level, trafo)
    q = quantile(Normal(), 1 - (1 - level)/2)
    which = searchsortedlast(npe.time, t)
    return trafo(npe, q, which)
end

# syntactic sugar for vectorising over all times
function StatsBase.confint(npe::SurvivalEstimator; level::Float64 = 0.95)
    return confint.(Ref(npe), npe.time; level = level)
end

function StatsBase.confint(
    npe::StatsModels.TableStatisticalModel{<:SurvivalEstimator, <:AbstractMatrix};
    level::Float64 = 0.95
)
    return confint.(Ref(npe.model), npe.model.time, level = level)
end

Base.time(npe::SurvivalEstimator) = npe.time
survival(npe::SurvivalEstimator) = npe.survival
StatsBase.std(npe::SurvivalEstimator) = npe.std
distribution(npe::SurvivalEstimator) = npe.distribution

function Base.time(
    npe::StatsModels.TableStatisticalModel{<:SurvivalEstimator, <:AbstractMatrix}
)
    return npe.model.time
end
function survival(
    npe::StatsModels.TableStatisticalModel{<:SurvivalEstimator, <:AbstractMatrix}
)
    return npe.model.survival
end
function StatsBase.std(
    npe::StatsModels.TableStatisticalModel{<:SurvivalEstimator, <:AbstractMatrix}
)
    return npe.model.std
end
function distribution(
    npe::StatsModels.TableStatisticalModel{<:SurvivalEstimator, <:AbstractMatrix}
)
    return npe.model.distribution
end
